/**
 * Logger Utility - Structured logging for test execution
 */
// Define and export the Logger class for use in other modules
export class Logger {
  // Static log method that accepts a message and an optional log level (defaults to 'INFO')
  static log(message, level = "INFO") {
    // Get the current date and time in ISO format for the timestamp
    const timestamp = new Date().toISOString();
    // Format the message string to include the timestamp, log level, and the message content
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    // Switch based on the provided log level
    switch (level) {
      // Case for error messages
      case "ERROR":
        // Output the formatted message to the console as an error
        console.error(formattedMessage);
        // Break out of the switch statement
        break;
      // Case for warning messages
      case "WARN":
        // Output the formatted message to the console as a warning
        console.warn(formattedMessage);
        // Break out of the switch statement
        break;
      // Default case for all other levels (e.g., INFO)
      default:
        // Output the formatted message to the standard console log
        console.log(formattedMessage);
    }
  }

  // Static helper method specifically for INFO level messages
  static info(message) {
    // Call the main log method with the message and 'INFO' level
    this.log(message, "INFO");
  }

  // Static helper method specifically for ERROR level messages
  static error(message) {
    // Call the main log method with the message and 'ERROR' level
    this.log(message, "ERROR");
  }

  // Static helper method specifically for WARN level messages
  static warn(message) {
    // Call the main log method with the message and 'WARN' level
    this.log(message, "WARN");
  }

  // Static helper method to log a distinct test step
  static step(stepName) {
    // Log the step name prefixed with "Step: " using the info level
    this.info(`Step: ${stepName}`);
  }
}
