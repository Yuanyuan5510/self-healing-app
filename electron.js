// 在应用程序最开始就配置环境变量
const { app, BrowserWindow, dialog, ipcMain } = require('electron');

// 设置AppUserModelId
app.setAppUserModelId('self-healing-app');

// 禁用安全警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const path = require('path');
const fs = require('fs');
const compress = require('./main-app/bin/app');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'gui/preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            // 启用远程模块以支持调试
            enableRemoteModule: true
          },
    });

    mainWindow.loadFile(path.join(__dirname, 'gui/index.html'));
    
    // 生产环境不打开开发者工具
      // mainWindow.webContents.openDevTools();
    
    // 监听渲染进程的console.log输出
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`[渲染进程] ${message} (${sourceId}:${line})`);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('compress-file', (event, inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            compress.compressFile(inputPath, outputPath);
            resolve({ success: true, type: 'compression', messageKey: 'COMPRESSION_SUCCESS' });
        } catch (error) {
            reject({ success: false, errorKey: 'COMPRESSION_FAILED', error: error.message });
        }
    });
});

ipcMain.handle('decompress-file', (event, zipPath, outputDir) => {
    return new Promise((resolve, reject) => {
        try {
            compress.decompressFile(zipPath, outputDir);
            resolve({ success: true, type: 'decompression', messageKey: 'DECOMPRESSION_SUCCESS' });
        } catch (error) {
            reject({ success: false, errorKey: 'DECOMPRESSION_FAILED', error: error.message });
        }
    });
});

ipcMain.handle('open-file-dialog', (event, options = {}) => {
    // 默认配置：允许选择文件和文件夹，不设置过滤器
    const dialogOptions = {
        properties: ['openFile', 'openDirectory'],
        filters: []
    };

    // 如果指定了只用于解压，则设置压缩文件过滤器
    if (options.forDecompression) {
        dialogOptions.properties = ['openFile'];
        dialogOptions.filters = [
            {
                name: 'Compressed Files',
                extensions: ['zip', 'rar', '7z', 'tar', 'gz']
            },
            {
                name: 'All Files',
                extensions: ['*']
            }
        ];
    }
    
    // 如果指定了只允许选择文件，则移除openDirectory属性
    if (options.onlyFiles) {
        dialogOptions.properties = ['openFile'];
    }

    return dialog.showOpenDialog(mainWindow, dialogOptions);
});

ipcMain.handle('open-directory-dialog', () => {
    return dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
});

// 文件预览处理程序
ipcMain.handle('preview-file', (event, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            // 检查文件是否存在
            const stats = fs.statSync(filePath);
            if (!stats.isFile()) {
                reject(`Path '${filePath}' is not a file.`);
                return;
            }
            
            // 检查文件大小，限制为10MB以内的文件才能预览
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
            
            if (fileSizeInMB > 10) {
                reject(`File '${filePath}' is too large to preview (${fileSizeInMB.toFixed(2)}MB). Only files smaller than 10MB can be previewed.`);
                return;
            }
            
            // 尝试读取文件内容
            let content = '';
            try {
                content = fs.readFileSync(filePath, 'utf8');
                // 对于二进制文件，如果读取结果包含无效的UTF-8字符，就返回文件信息而不是内容
                if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content)) {
                    resolve({
                        type: 'binary',
                        path: filePath,
                        size: fileSizeInBytes,
                        stats: stats
                    });
                    return;
                }
            } catch (e) {
                // 如果读取为UTF-8失败，表明是二进制文件
                resolve({
                    type: 'binary',
                    path: filePath,
                    size: fileSizeInBytes,
                    stats: stats
                });
                return;
            }
            
            // 文本文件，返回内容
            resolve({
                type: 'text',
                path: filePath,
                content: content,
                size: fileSizeInBytes,
                stats: stats
            });
        } catch (error) {
            reject(`Error previewing file: ${error.message}`);
        }
    });
});

// 获取路径类型处理程序
ipcMain.handle('get-path-type', (event, path) => {
    try {
        const stats = fs.statSync(path);
        if (stats.isDirectory()) {
            return 'directory';
        } else if (stats.isFile()) {
            return 'file';
        }
        return 'other';
    } catch (error) {
        throw new Error(`Failed to check path type: ${error.message}`);
    }
});

// 目录预览处理程序
ipcMain.handle('preview-directory', (event, dirPath) => {
    return new Promise((resolve, reject) => {
        try {
            // 检查目录是否存在
            const stats = fs.statSync(dirPath);
            if (!stats.isDirectory()) {
                reject(`Path '${dirPath}' is not a directory.`);
                return;
            }
            
            // 读取目录内容
            const files = fs.readdirSync(dirPath);
            
            // 获取每个文件的详细信息
            const directoryContents = files.map(file => {
                const filePath = path.join(dirPath, file);
                try {
                    const fileStats = fs.statSync(filePath);
                    return {
                        name: file,
                        path: filePath,
                        isDirectory: fileStats.isDirectory(),
                        size: fileStats.size,
                        modified: fileStats.mtime
                    };
                } catch (e) {
                    return {
                        name: file,
                        path: filePath,
                        error: e.message
                    };
                }
            });
            
            resolve({
                type: 'directory',
                path: dirPath,
                contents: directoryContents,
                stats: stats
            });
        } catch (error) {
            reject(`Error previewing directory: ${error.message}`);
        }
    });
});