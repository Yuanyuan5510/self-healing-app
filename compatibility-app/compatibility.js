const fs = require('fs');
const path = require('path');
const logger = require('../../shared/logger');

logger.info('Compatibility mode activated. Providing basic file operations.');

function displayFileContent(filePath) {
    logger.info(`Displaying content of file: ${filePath}`);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(content);
    } catch (error) {
        logger.error(`Failed to read file: ${error.message}`);
    }
}

try {
    const filePath = process.argv[2];
    
    if (!filePath) {
        throw new Error('Usage: node compatibility-app/compatibility.js <filePath>');
    }
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    
    displayFileContent(filePath);
} catch (error) {
    logger.error(`Compatibility error: ${error.message}`);
    logger.error(`Stack Trace: ${error.stack}`);
}