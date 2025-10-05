const path = require('path');
const fs = require('fs');

function logToErrorFile(message) {
  const mainDir = path.dirname(path.dirname(path.dirname(__filename)));
  const logDir = path.join(mainDir, 'log');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logFile = path.join(logDir, 'error.log');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

module.exports = {
  info: (message) => {
    console.log(`[INFO] ${message}`);
    logToErrorFile(`[INFO] ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] ${message}`);
    logToErrorFile(`[ERROR] ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${message}`);
    logToErrorFile(`[WARN] ${message}`);
  }
};