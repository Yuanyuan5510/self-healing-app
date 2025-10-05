const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    compressFile: (inputPath, outputPath) => ipcRenderer.invoke('compress-file', inputPath, outputPath),
    decompressFile: (zipPath, outputDir) => ipcRenderer.invoke('decompress-file', zipPath, outputDir),
    openFileDialog: (options = {}) => ipcRenderer.invoke('open-file-dialog', options),
    getPathType: (path) => ipcRenderer.invoke('get-path-type', path),
    openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
    previewFile: (filePath) => ipcRenderer.invoke('preview-file', filePath),
    previewDirectory: (dirPath) => ipcRenderer.invoke('preview-directory', dirPath)
});