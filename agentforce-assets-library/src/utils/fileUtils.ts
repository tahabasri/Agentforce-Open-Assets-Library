import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), '..');

// Interface for JSON file content
export interface ActionFile {
  sourceFile: string;
  author?: string;
  company?: string;
  dependencies?: string[];
  [key: string]: string | string[] | undefined;
}

// Function to get all subdirectories in a directory
export function getSubdirectories(directoryPath: string): string[] {
  try {
    const fullPath = path.join(baseDir, directoryPath);
    if (!fs.existsSync(fullPath)) {
      return [];
    }
    
    return fs.readdirSync(fullPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return [];
  }
}

// Function to read JSON files from a directory
export function readJsonFiles(directoryPath: string): { [fileName: string]: ActionFile } {
  const fullPath = path.join(baseDir, directoryPath);
  const result: { [fileName: string]: ActionFile } = {};

  try {
    if (!fs.existsSync(fullPath)) {
      return {};
    }

    const files = fs.readdirSync(fullPath, { withFileTypes: true })
      .filter(file => file.isFile() && path.extname(file.name).toLowerCase() === '.json');

    for (const file of files) {
      try {
        const filePath = path.join(fullPath, file.name);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        result[file.name] = jsonData;
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
  }

  return result;
}

// Function to check if a directory exists
export function directoryExists(directoryPath: string): boolean {
  const fullPath = path.join(baseDir, directoryPath);
  try {
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// Main function to get category data
export function getCategoryData(categoryType: 'industries' | 'products'): {
  [subCategory: string]: {
    actions: { [fileName: string]: ActionFile };
    topics: { [fileName: string]: ActionFile };
    agents: { [fileName: string]: ActionFile };
  }
} {
  const subCategories = getSubdirectories(categoryType);
  const result: {
    [subCategory: string]: {
      actions: { [fileName: string]: ActionFile };
      topics: { [fileName: string]: ActionFile };
      agents: { [fileName: string]: ActionFile };
      icon?: string;
    }
  } = {};

  for (const subCategory of subCategories) {
    let icon = undefined;
    try {
      const configPath = `${categoryType}/${subCategory}/config.json`;
      const fullConfigPath = require('path').join(process.cwd(), '..', configPath);
      if (require('fs').existsSync(fullConfigPath)) {
        const configRaw = require('fs').readFileSync(fullConfigPath, 'utf-8');
        const config = JSON.parse(configRaw);
        icon = config.icon;
      }
    } catch (e) {
      icon = undefined;
    }

    // Helper to add navigation info to each asset
    function addNavInfo(obj: { [fileName: string]: ActionFile }, assetType: string) {
      for (const fileName of Object.keys(obj)) {
        obj[fileName].category = categoryType;
        obj[fileName].categoryName = subCategory;
        obj[fileName].assetType = assetType;
        obj[fileName].fileName = fileName.replace('.json', '');
      }
      return obj;
    }

    result[subCategory] = {
      actions: addNavInfo(readJsonFiles(`${categoryType}/${subCategory}/actions`), 'actions'),
      topics: addNavInfo(readJsonFiles(`${categoryType}/${subCategory}/topics`), 'topics'),
      agents: addNavInfo(readJsonFiles(`${categoryType}/${subCategory}/agents`), 'agents'),
      icon,
    };
  }

  return result;
}
