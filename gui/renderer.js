// 使用preload.js中暴露的api对象
console.log('renderer.js 已加载');

// 不使用require，而是创建简单的路径处理函数
function getPathSeparator(filePath) {
    return filePath.includes('\\') ? '\\' : '/';
}

// 替代path.basename()函数
function getFileName(filePath) {
    const separator = getPathSeparator(filePath);
    const parts = filePath.split(separator);
    return parts[parts.length - 1];
}

// 获取当前语言或默认使用英语
function getText(key) {
    if (window.appLang && window.appLang.getCurrentLanguage) {
        const lang = window.appLang.getCurrentLanguage();
        const translations = window.appLang.languages[lang];
        if (translations && translations[key]) {
            return translations[key];
        }
    }
    // 默认返回英语文本
    return {
        openFileError: 'Error opening file dialog: ',
        openDirectoryError: 'Error opening directory dialog: ',
        selectInputOutput: 'Please select input and output paths.',
        compressing: 'Compressing file, please wait...',
        selectZipExtract: 'Please select a compressed file and extraction directory.',
        extracting: 'Extracting file, please wait...',
        filePreviewTitle: 'File Preview:',
        fileInfoTitle: 'File Info:',
        directoryPreviewTitle: 'Directory Preview:',
        pleaseSelectToPreview: 'Please select a file or directory to preview.',
        pleaseSelectCompressedToPreview: 'Please select a compressed file to preview.',
        errorPreviewingPath: 'Error previewing path:',
        errorPreviewingCompressedFile: 'Error previewing compressed file:',
        binaryFileType: 'Binary file (cannot be previewed as text)',
        isAFileNotDirectory: 'is a file, not a directory. Please select a folder path to compress.',
        invalidPathType: 'Invalid path type. Please select a valid file or directory.',
        previewFolderSuccess: 'Successfully previewed folder: '
    }[key] || key;
}

// 确保DOM完全加载后再绑定事件监听器
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM已完全加载，开始绑定事件监听器');
    
    const browseInputBtn = document.getElementById('browseInput');
    const browseOutputBtn = document.getElementById('browseOutput');
    const compressBtn = document.getElementById('compressBtn');
    const browseZipFileBtn = document.getElementById('browseZipFile');
    const browseExtractDirBtn = document.getElementById('browseExtractDir');
    const decompressBtn = document.getElementById('decompressBtn');
    
    console.log('元素查找结果:', {
        browseInputBtn: !!browseInputBtn,
        browseOutputBtn: !!browseOutputBtn,
        compressBtn: !!compressBtn,
        browseZipFileBtn: !!browseZipFileBtn,
        browseExtractDirBtn: !!browseExtractDirBtn,
        decompressBtn: !!decompressBtn
    });

    // 添加语言切换事件监听器
    window.addEventListener('languageChanged', () => {
        console.log('Language changed, updating UI elements');
        // 这里不需要更新按钮文本，因为app.js会处理
    });
    
    // 获取预览相关元素
    const previewModal = document.getElementById('previewModal');
    const previewTitle = document.getElementById('previewTitle');
    const previewContent = document.getElementById('previewContent');
    const closePreviewBtn = document.getElementById('closePreview');
    
    // 关闭预览弹窗
    closePreviewBtn.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });
    
    // 点击弹窗外部关闭弹窗
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 格式化日期
    function formatDate(date) {
        return new Date(date).toLocaleString();
    }
    
    // 显示文件预览
    function showFilePreview(result) {
        if (result.type === 'text') {
            previewTitle.textContent = `${getText('filePreviewTitle')} ${path.basename(result.path)}`;
            previewContent.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${result.content}</pre>`;
        } else if (result.type === 'binary') {
            previewTitle.textContent = `${getText('fileInfoTitle')} ${getFileName(result.path)}`;
            previewContent.innerHTML = `
                <p><strong>${getText('zipFileLabel')}</strong> ${result.path}</p>
                <p><strong>Size:</strong> ${formatFileSize(result.size)}</p>
                <p><strong>Type:</strong> ${getText('binaryFileType')}</p>
                <p><strong>Modified:</strong> ${formatDate(result.stats.mtime)}</p>
            `;
        }
        previewModal.style.display = 'flex';
    }
    
    // 显示目录预览
    function showDirectoryPreview(result) {
        previewTitle.textContent = `${getText('directoryPreviewTitle')} ${getFileName(result.path)}`;
        
        // 按类型和名称排序
        const sortedContents = [...result.contents].sort((a, b) => {
            // 先按目录排序
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            // 然后按名称排序
            return a.name.localeCompare(b.name);
        });
        
        let html = `<p><strong>${getText('extractDirLabel')}</strong> ${result.path}</p><br>`;
        html += '<table style="width: 100%; border-collapse: collapse;">';
        html += '<tr style="background-color: #f8f9fa;">';
        html += '<th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Name</th>';
        html += '<th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Type</th>';
        html += '<th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Size</th>';
        html += '<th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Modified</th>';
        html += '</tr>';
        
        sortedContents.forEach(item => {
            html += '<tr>';
            html += `<td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>`;
            
            if (item.isDirectory) {
                html += `<td style="padding: 8px; border-bottom: 1px solid #eee;">Folder</td>`;
                html += `<td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">-</td>`;
            } else {
                html += `<td style="padding: 8px; border-bottom: 1px solid #eee;">File</td>`;
                html += `<td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatFileSize(item.size)}</td>`;
            }
            
            html += `<td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.modified ? formatDate(item.modified) : '-'}</td>`;
            html += '</tr>';
        });
        
        html += '</table>';
        previewContent.innerHTML = html;
        previewModal.style.display = 'flex';
    }
    
    browseInputBtn.addEventListener('click', () => {
        console.log('点击了浏览输入按钮');
        // 只允许选择文件，不允许选择文件夹
        window.api.openFileDialog({ onlyFiles: true }).then((result) => {
            console.log('文件对话框返回结果:', result);
            if (result && result.canceled === false && result.filePaths && result.filePaths.length > 0) {
                document.getElementById('inputPath').value = result.filePaths[0];
                console.log('已设置输入路径:', result.filePaths[0]);
            }
        }).catch(error => {
            console.error('打开文件对话框时出错:', error);
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('openFileError')}${error}</p>`;
        });
    });
    

    
    // 预览输入文件夹按钮事件处理
    document.getElementById('previewInputFolder').addEventListener('click', () => {
        console.log('点击了预览输入文件夹按钮');
        const inputPath = document.getElementById('inputPath').value;
        
        // 打开目录选择对话框让用户选择文件夹
        window.api.openDirectoryDialog().then((result) => {
            console.log('目录对话框返回结果:', result);
            if (result && result.canceled === false && result.filePaths && result.filePaths.length > 0) {
                // 更新输入路径
                const selectedFolder = result.filePaths[0];
                document.getElementById('inputPath').value = selectedFolder;
                console.log('已设置输入路径为文件夹:', selectedFolder);
                
                // 直接预览选择的文件夹
                window.api.previewDirectory(selectedFolder).then(result => {
                    showDirectoryPreview(result);
                    document.getElementById('outputContent').innerHTML = `<p style="color: green;">${getText('previewFolderSuccess')} ${selectedFolder}</p>`;
                    // 自动滚动到输出内容区域
                    document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
                }).catch(error => {
                    document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('errorPreviewingPath')} ${error}</p>`;
                });
            }
        }).catch(error => {
            console.error('打开目录对话框时出错:', error);
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('openDirectoryError')}${error}</p>`;
        });
    });

    browseOutputBtn.addEventListener('click', () => {
        console.log('点击了浏览输出按钮');
        window.api.openDirectoryDialog().then((result) => {
            console.log('目录对话框返回结果:', result);
            if (result && result.canceled === false && result.filePaths && result.filePaths.length > 0) {
                // 使用原生JavaScript获取目录路径并添加output.zip
                const directoryPath = result.filePaths[0];
                const separator = getPathSeparator(directoryPath);
                document.getElementById('outputPath').value = directoryPath + separator + 'output.zip';
                console.log('已设置输出路径:', document.getElementById('outputPath').value);
            }
        }).catch(error => {
            console.error('打开目录对话框时出错:', error);
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('openDirectoryError')}${error}</p>`;
        });
    });

    compressBtn.addEventListener('click', () => {
        console.log('点击了压缩按钮');
        const inputPath = document.getElementById('inputPath').value;
        const outputPath = document.getElementById('outputPath').value;

        console.log('输入路径:', inputPath);
        console.log('输出路径:', outputPath);

        if (!inputPath || !outputPath) {
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('selectInputOutput')}</p>`;
            // 自动滚动到输出内容区域
            document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        document.getElementById('outputContent').innerHTML = `<p style="color: blue;">${getText('compressing')}</p>`;
        
        // 自动滚动到输出内容区域
        document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
        
        window.api.compressFile(inputPath, outputPath).then((response) => {
            if (response.success && response.type === 'compression') {
                document.getElementById('outputContent').innerHTML = `<p style="color: green;">${getText('compressionSuccess')}</p>`;
            }
        }).catch((error) => {
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('errorPrefix')}${error.error}</p>`;
        });
    });
    
    // 浏览压缩文件按钮事件处理
    browseZipFileBtn.addEventListener('click', () => {
        console.log('点击了浏览压缩文件按钮');
        // 解压功能：只允许选择压缩文件
        window.api.openFileDialog({ forDecompression: true }).then((result) => {
            console.log('文件对话框返回结果:', result);
            if (result && result.canceled === false && result.filePaths && result.filePaths.length > 0) {
                document.getElementById('zipFilePath').value = result.filePaths[0];
                console.log('已设置压缩文件路径:', result.filePaths[0]);
            }
        }).catch(error => {
            console.error('打开文件对话框时出错:', error);
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('openFileError')}${error}</p>`;
        });
    });
    


    // 浏览解压目录按钮事件处理
    browseExtractDirBtn.addEventListener('click', () => {
        console.log('点击了浏览解压目录按钮');
        window.api.openDirectoryDialog().then((result) => {
            console.log('目录对话框返回结果:', result);
            if (result && result.canceled === false && result.filePaths && result.filePaths.length > 0) {
                document.getElementById('extractDirPath').value = result.filePaths[0];
                console.log('已设置解压目录路径:', result.filePaths[0]);
            }
        }).catch(error => {
            console.error('打开目录对话框时出错:', error);
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('openDirectoryError')}${error}</p>`;
        });
    });

    // 解压按钮事件处理
    decompressBtn.addEventListener('click', () => {
        console.log('点击了解压按钮');
        const zipFilePath = document.getElementById('zipFilePath').value;
        const extractDirPath = document.getElementById('extractDirPath').value;

        console.log('压缩文件路径:', zipFilePath);
        console.log('解压目录路径:', extractDirPath);

        if (!zipFilePath || !extractDirPath) {
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('selectZipExtract')}</p>`;
            // 自动滚动到输出内容区域
            document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        document.getElementById('outputContent').innerHTML = `<p style="color: blue;">${getText('extracting')}</p>`;
        
        // 自动滚动到输出内容区域
        document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
        
        window.api.decompressFile(zipFilePath, extractDirPath).then((response) => {
            if (response.success && response.type === 'decompression') {
                document.getElementById('outputContent').innerHTML = `<p style="color: green;">${getText('decompressionSuccess')}</p>`;
            }
        }).catch((error) => {
            document.getElementById('outputContent').innerHTML = `<p style="color: red;">${getText('errorPrefix')}${error.error}</p>`;
        });
    });

    console.log('事件监听器绑定完成');
});