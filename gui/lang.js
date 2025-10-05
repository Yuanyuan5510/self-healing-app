// 语言配置文件
export const languages = {
    en: {
        title: "WS File Compression Tool",
        inputFileLabel: "Input File/Directory:",
        outputPathLabel: "Output Path:",
        compressBtn: "Compress File",
        decompressionSection: "Decompression",
        zipFileLabel: "Compressed File:",
        extractDirLabel: "Extract Directory:",
        decompressBtn: "Decompress File",
        browseBtn: "Browse",
        browseFilesBtn: "Browse Files",
        outputTitle: "Output:",
        selectPathsMessage: "Please select input and output paths.",
        selectingFile: "Opening file dialog...",
        selectingDirectory: "Opening directory dialog...",
        compressingMessage: "Compressing file, please wait...",
        decompressingMessage: "Decompressing file, please wait...",
        compressionSuccess: "Compression completed successfully!",
        decompressionSuccess: "Decompression completed successfully!",
        errorPrefix: "Error: ",
        fileDialogError: "Error opening file dialog:",
        directoryDialogError: "Error opening directory dialog:",
        selectZipAndExtractPaths: "Please select compressed file and extract directory.",
        // 为renderer.js添加的键名
        openFileError: "Error opening file dialog: ",
        openDirectoryError: "Error opening directory dialog: ",
        selectInputOutput: "Please select input and output paths.",
        compressing: "Compressing file, please wait...",
        selectZipExtract: "Please select a compressed file and extraction directory.",
        extracting: "Extracting file, please wait...",
        // 预览功能相关文本
        previewFolderBtn: "Preview Folder",
        filePreviewTitle: "File Preview:",
        fileInfoTitle: "File Info:",
        directoryPreviewTitle: "Directory Preview:",
        pleaseSelectToPreview: "Please select a file or directory to preview.",
        pleaseSelectCompressedToPreview: "Please select a compressed file to preview.",
        errorPreviewingPath: "Error previewing path:",
        errorPreviewingCompressedFile: "Error previewing compressed file:",
        errorCheckingPathType: "Error checking path type:",
        binaryFileType: "Binary file (cannot be previewed as text)",
        tooLargeFileError: "File is too large to preview. Only files smaller than 10MB can be previewed.",
        isAFileNotDirectory: "is a file, not a directory. Please select a folder path to compress.",
        invalidPathType: "Invalid path type. Please select a valid file or directory.",
        previewFolderSuccess: "Successfully previewed folder: "
    },
    zh: {
        title: "WS压缩工具",
        inputFileLabel: "输入文件/目录:",
        outputPathLabel: "输出路径:",
        compressBtn: "压缩文件",
        decompressionSection: "解压缩",
        zipFileLabel: "压缩文件:",
        extractDirLabel: "解压目录:",
        decompressBtn: "解压文件",
        browseBtn: "浏览",
        browseFilesBtn: "浏览文件",
        outputTitle: "输出:",
        selectPathsMessage: "请选择输入和输出路径。",
        selectingFile: "正在打开文件对话框...",
        selectingDirectory: "正在打开目录对话框...",
        compressingMessage: "正在压缩文件，请稍候...",
        decompressingMessage: "正在解压文件，请稍候...",
        compressionSuccess: "压缩成功完成！",
        decompressionSuccess: "解压成功完成！",
        errorPrefix: "错误: ",
        fileDialogError: "打开文件对话框时出错:",
        directoryDialogError: "打开目录对话框时出错:",
        selectZipAndExtractPaths: "请选择压缩文件和解压目录。",
        // 为renderer.js添加的键名
        openFileError: "打开文件对话框时出错: ",
        openDirectoryError: "打开目录对话框时出错: ",
        selectInputOutput: "请选择输入和输出路径。",
        compressing: "正在压缩文件，请稍候...",
        selectZipExtract: "请选择压缩文件和解压目录。",
        extracting: "正在解压文件，请稍候...",
        // 预览功能相关文本
        previewFolderBtn: "预览文件夹",
        filePreviewTitle: "文件预览:",
        fileInfoTitle: "文件信息:",
        directoryPreviewTitle: "目录预览:",
        pleaseSelectToPreview: "请选择要预览的文件或目录。",
        pleaseSelectCompressedToPreview: "请选择要预览的压缩文件。",
        errorPreviewingPath: "预览路径时出错:",
        errorPreviewingCompressedFile: "预览压缩文件时出错:",
        errorCheckingPathType: "检查路径类型时出错:",
        binaryFileType: "二进制文件（无法作为文本预览）",
        tooLargeFileError: "文件太大，无法预览。仅支持小于10MB的文件预览。",
        isAFileNotDirectory: "是一个文件，不是目录。请选择需要压缩的文件夹路径。",
        invalidPathType: "无效的路径类型。请选择有效的文件或目录。",
        previewFolderSuccess: "成功预览文件夹: "
    }
};

// 默认语言
export const defaultLanguage = 'en';

// 获取当前语言
export function getCurrentLanguage() {
    return localStorage.getItem('appLanguage') || defaultLanguage;
}

// 设置当前语言
export function setCurrentLanguage(lang) {
    if (languages[lang]) {
        localStorage.setItem('appLanguage', lang);
        return lang;
    }
    return defaultLanguage;
}

// 获取翻译
export function t(key) {
    const lang = getCurrentLanguage();
    return languages[lang][key] || languages[defaultLanguage][key] || key;
}