// Import the file system module to interact with the file system
import fs from "fs";
// Import the path module to manage file and directory paths
import path from "path";

// Define the directory path for data files by joining the current working directory with "data"
const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Test Data Utility - Load and manage test data
 */
// Define and export the TestDataUtil class
export class TestDataUtil {
  // Static method to load a JSON file given its name
  static loadJson(fileName) {
    // Construct the full file path by joining the data directory and the filename with .json extension
    const filePath = path.join(DATA_DIR, `${fileName}.json`);
    // Check if the file exists at the constructed path
    if (!fs.existsSync(filePath)) {
      // If the file does not exist, throw an error indicating the file was not found
      throw new Error(`Test data file not found: ${filePath}`);
    }
    // Read the file synchronously as a UTF-8 string, parse it as JSON, and return the object
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  // Static method to retrieve an environment variable or return a default value
  static getEnv(key, defaultValue = "") {
    // Return the value of the environment variable specified by key, or the default value if undefined
    return process.env[key] || defaultValue;
  }
}
