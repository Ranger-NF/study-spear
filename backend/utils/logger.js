import morgan from 'morgan';

// Create a custom logger that includes both Morgan and console methods
const logger = {
  // Morgan middleware for HTTP logging
  http: morgan('dev'),
  
  // Console logging methods
  info: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
  debug: (...args) => console.debug(...args)
};

export default logger; 