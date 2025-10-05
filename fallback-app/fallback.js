const fs = require('fs');
const { createWriteStream } = require('fs');
const logger = require('../../shared/logger');

logger.info('Fallback app started. Creating a basic archive manually.');

function createBasicArchive(inputPath, outputPath) {
  logger.info(`Creating a basic archive: ${inputPath} -> ${outputPath}`);
  
  // 简单的文件复制
  fs.copyFileSync(inputPath, outputPath);
  logger.info(`Basic archive created at ${outputPath}`);
}

try {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  
  if (!inputPath || !outputPath) {
    throw new Error('Usage: node fallback-app/fallback.js <inputPath> <outputPath>');
  }
  
  createBasicArchive(inputPath, outputPath);
} catch (error) {
  logger.error(`Fallback failed: ${error.message}`);
  logger.error(`Stack Trace: ${error.stack}`);
  logger.warn('Starting compatibility mode...');
  startCompatibilityApp();
}

function startCompatibilityApp() {
  const compatibilityPath = path.join(__dirname, '../compatibility-app/compatibility.js');
  logger.info(`Launching compatibility app from: ${compatibilityPath}`);
  const child = spawn('node', [compatibilityPath], { stdio: 'inherit', detached: true });
  child.unref();
  process.exit(1);
}
