const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const AdmZip = require('adm-zip');
const logger = require('../../shared/logger');

const currentScript = path.resolve(__filename);

// 全局错误捕获机制
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error.message);
  logger.error(`Stack Trace: ${error.stack}`);
  handleError(error);
});

process.on('unhandledRejection', (reason) => {
  const error = new Error(reason instanceof Error ? reason.message : reason);
  logger.error('Unhandled Rejection:', error.message);
  logger.error(`Stack Trace: ${error.stack}`);
  handleError(error);
});

// 增强的压缩文件的主逻辑
function compressFile(inputPath, outputPath) {
  logger.info(`Compressing file/directory: ${inputPath} -> ${outputPath}`);
  
  try {
    const zip = new AdmZip();
    if (fs.existsSync(inputPath)) {
      if (fs.statSync(inputPath).isDirectory()) {
        zip.addLocalFolder(inputPath);
      } else {
        zip.addLocalFile(inputPath);
      }
      zip.writeZip(outputPath);
      logger.info('Compression completed successfully');
    } else {
      throw new Error(`Input path does not exist: ${inputPath}`);
    }
  } catch (error) {
    logger.error(`Compression failed: ${error.message}`);
    logger.error(`Stack Trace: ${error.stack}`);
    throw error;
  }
}

// 解压缩文件的逻辑
function decompressFile(zipPath, outputDir) {
  logger.info(`Decompressing file: ${zipPath} -> ${outputDir}`);
  
  try {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outputDir, true);
    logger.info('Decompression completed successfully');
  } catch (error) {
    logger.error(`Decompression failed: ${error.message}`);
    logger.error(`Stack Trace: ${error.stack}`);
    throw error;
  }
}

// 错误处理函数
function handleError(error) {
  logger.error(`Handling error: ${error.message}`);
  
  if (tryRepair(error)) {
    logger.info('Repair succeeded. Restarting...');
    restartMainApp();
  } else {
    logger.warn('Repair failed. Starting fallback app...');
    startFallbackApp();
  }
}

// 尝试修复错误
function tryRepair(error) {
  logger.info(`Attempting repair for error: ${error.message}`);
  
  if (error.message.includes('ENOENT')) {
    logger.warn('zip command not found. Please install it globally.');
    return false;
  } else if (error.code === 'MODULE_NOT_FOUND') {
    logger.warn('Missing module found. Attempting to reinstall...');
    const npmProcess = spawn('npm', ['install'], { cwd: path.dirname(currentScript), stdio: 'pipe' });
    npmProcess.on('close', (code) => {
      return code === 0;
    });
  }
  return false;
}

// 重启主程序
function restartMainApp() {
  logger.info('Restarting the main application...');
  const child = spawn('node', [currentScript], { stdio: 'inherit', detached: true });
  child.unref();
  process.exit(0);
}

// 启动备用程序
function startFallbackApp() {
  const fallbackPath = path.join(__dirname, '../fallback-app/fallback.js');
  logger.info(`Launching fallback app from: ${fallbackPath}`);
  const child = spawn('node', [fallbackPath], { stdio: 'inherit', detached: true });
  child.unref();
  process.exit(1);
}

// 当直接通过命令行执行时的主程序入口逻辑
if (require.main === module) {
  try {
    const command = process.argv[2];
    const inputPath = process.argv[3];
    const outputPath = process.argv[4];
    
    if (!command || !inputPath || !outputPath) {
      throw new Error('Usage: node main-app/bin/app.js <compress|decompress> <inputPath> <outputPath>');
    }
    
    if (command === 'compress') {
      compressFile(inputPath, outputPath);
    } else if (command === 'decompress') {
      decompressFile(inputPath, outputPath);
    } else {
      throw new Error('Invalid command. Use "compress" or "decompress".');
    }
  } catch (error) {
    logger.error(`Initialization failed: ${error.message}`);
    logger.error(`Stack Trace: ${error.stack}`);
    handleError(error);
  }
}

// 导出函数供electron.js使用
module.exports = {
  compressFile,
  decompressFile
};