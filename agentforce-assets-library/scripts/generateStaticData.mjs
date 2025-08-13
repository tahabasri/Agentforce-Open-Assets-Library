import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory is one level up from the script location
const baseDir = path.join(__dirname, '../..');

// Interface for JSON file content
function getSubdirectories(directoryPath) {
  try {
    const fullPath = path.join(baseDir, directoryPath);
    if (!fs.existsSync(fullPath)) {
      return [];
    }
    
    return fs.readdirSync(fullPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error(`Error reading subdirectories in ${directoryPath}:`, error);
    return [];
  }
}

// Function to read JSON files from a directory
function readJsonFiles(directoryPath) {
  const fullPath = path.join(baseDir, directoryPath);
  const result = {};

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

// Main function to get category data
function getCategoryData(categoryType) {
  const subCategories = getSubdirectories(categoryType);
  const result = {};

  for (const subCategory of subCategories) {
    let icon = undefined;
    try {
      const configPath = path.join(baseDir, categoryType, subCategory, 'config.json');
      if (fs.existsSync(configPath)) {
        const configRaw = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configRaw);
        icon = config.icon;
      }
    } catch {
      icon = undefined;
    }

    // Helper to add navigation info to each asset
    function addNavInfo(obj, assetType) {
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

// Generate all possible static paths for assets
function generateStaticPaths() {
  const paths = [];
  const industries = getCategoryData('industries');
  const products = getCategoryData('products');

  // Process industries
  Object.entries(industries).forEach(([industry, data]) => {
    // Actions
    Object.keys(data.actions || {}).forEach(fileName => {
      paths.push({
        params: {
          category: 'industries',
          categoryName: industry,
          assetType: 'actions',
          fileName: fileName.replace('.json', '')
        }
      });
    });

    // Topics
    Object.keys(data.topics || {}).forEach(fileName => {
      paths.push({
        params: {
          category: 'industries',
          categoryName: industry,
          assetType: 'topics',
          fileName: fileName.replace('.json', '')
        }
      });
    });

    // Agents
    Object.keys(data.agents || {}).forEach(fileName => {
      paths.push({
        params: {
          category: 'industries',
          categoryName: industry,
          assetType: 'agents',
          fileName: fileName.replace('.json', '')
        }
      });
    });
  });

  // Process products
  Object.entries(products).forEach(([product, data]) => {
    // Actions
    Object.keys(data.actions || {}).forEach(fileName => {
      paths.push({
        params: {
          category: 'products',
          categoryName: product,
          assetType: 'actions',
          fileName: fileName.replace('.json', '')
        }
      });
    });

    // Topics
    Object.keys(data.topics || {}).forEach(fileName => {
      paths.push({
        params: {
          category: 'products',
          categoryName: product,
          assetType: 'topics',
          fileName: fileName.replace('.json', '')
        }
      });
    });

    // Agents
    Object.keys(data.agents || {}).forEach(fileName => {
      paths.push({
        params: {
          category: 'products',
          categoryName: product,
          assetType: 'agents',
          fileName: fileName.replace('.json', '')
        }
      });
    });
  });

  return paths;
}

// Main execution
function generateStaticData() {
  // Create the data object
  const data = {
    industries: getCategoryData('industries'),
    products: getCategoryData('products')
  };

  // Generate paths for static generation
  const staticPaths = generateStaticPaths();

  // Ensure the public directory exists
  const publicDir = path.join(__dirname, '../public/generated');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write data to JSON file
  fs.writeFileSync(
    path.join(publicDir, 'data.json'),
    JSON.stringify(data, null, 2)
  );

  // Write paths to JSON file
  fs.writeFileSync(
    path.join(publicDir, 'staticPaths.json'),
    JSON.stringify(staticPaths, null, 2)
  );

  console.log('✅ Static data generated successfully!');
  console.log(`📊 Found ${Object.keys(data.industries).length} industries and ${Object.keys(data.products).length} products`);
  console.log(`🛣️ Generated ${staticPaths.length} static paths`);
}

// Execute the script
generateStaticData();
