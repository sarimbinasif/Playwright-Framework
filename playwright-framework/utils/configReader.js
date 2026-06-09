// utils/configReader.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigReader {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'config.json');
    this.config = null;
  }

  getConfig() {
    if (this.config) return this.config;

    const raw = fs.readFileSync(this.configPath, 'utf-8');
    const fileConfig = JSON.parse(raw);

    // Environment variables override file config
    this.config = {
      ...fileConfig,
      baseURL: process.env.BASE_URL || fileConfig.baseURL,
      environment: process.env.ENVIRONMENT || fileConfig.environment,
      headless: process.env.HEADLESS
        ? process.env.HEADLESS === 'true'
        : fileConfig.headless,
    };

    return this.config;
  }

  get(key) {
    return this.getConfig()[key];
  }
}

export const configReader = new ConfigReader();
