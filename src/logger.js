class Logger {
  constructor() {
    this.logLevel = null;
  }

  setLogLevel(logLevel) {
    this.logLevel = logLevel;
  }

  log(...args) {
    this.logLevel && console.log(...args);
  }

  debug(...args) {
    this.logLevel && console.debug(...args);
  }
}

const logger = new Logger();

export default logger;
