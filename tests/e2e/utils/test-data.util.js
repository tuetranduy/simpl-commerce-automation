import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Test Data Utility - Load and manage test data
 */
export class TestDataUtil {
  static loadJson(fileName) {
    const filePath = path.join(DATA_DIR, `${fileName}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  static getUser(role = 'default') {
    const users = this.loadJson('users');
    return users[role] || users.default;
  }

  static getEnv(key, defaultValue = '') {
    return process.env[key] || defaultValue;
  }
}
