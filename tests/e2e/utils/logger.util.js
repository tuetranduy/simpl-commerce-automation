/**
 * Logger Utility - Structured logging for test execution
 */
export class Logger {
  static log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    switch (level) {
      case 'ERROR':
        console.error(formattedMessage);
        break;
      case 'WARN':
        console.warn(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  static info(message) {
    this.log(message, 'INFO');
  }

  static error(message) {
    this.log(message, 'ERROR');
  }

  static warn(message) {
    this.log(message, 'WARN');
  }

  static step(stepName) {
    this.info(`Step: ${stepName}`);
  }
}
