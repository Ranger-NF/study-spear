import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Create a logger instance
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Console logging
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    // File logging for errors
    new transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    // File logging for all logs
    new transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    })
  ],
  exitOnError: false
});

// Add a stream for Morgan middleware
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

export default logger;