import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'test-data');

export class DataParser {
  /**
   * Read JSON test data.
   * @param {string} filename - relative to /test-data
   */
  static readJSON(filename) {
    const filepath = path.join(dataDir, filename);
    try {
      const raw = fs.readFileSync(filepath, 'utf-8');
      const data = JSON.parse(raw);
      logger.info(`Loaded JSON data from: ${filename}`);
      return data;
    } catch (err) {
      logger.error(`Failed to read JSON ${filename}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Read XML test data and parse to JS object.
   * @param {string} filename - relative to /test-data
   */
  static readXML(filename) {
    const filepath = path.join(dataDir, filename);
    try {
      const raw = fs.readFileSync(filepath, 'utf-8');
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
      });
      const data = parser.parse(raw);
      logger.info(`Loaded XML data from: ${filename}`);
      return data;
    } catch (err) {
      logger.error(`Failed to read XML ${filename}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Get a specific user object from users.json by key.
   * @param {string} userType - e.g. 'standard', 'lockedOut'
   */
  static getUser(userType) {
    const users = this.readJSON('users.json');
    if (!users[userType]) {
      throw new Error(`User type "${userType}" not found in users.json`);
    }
    return users[userType];
  }
}
