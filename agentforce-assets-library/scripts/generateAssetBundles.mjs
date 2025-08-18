import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory is one level up from the script location
const baseDir = path.join(__dirname, '../..');
const outputDir = path.join(__dirname, '../public/generated/assets');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the generated data file to get assets information
const dataFilePath = path.join(__dirname, '../public/generated/data.json');
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

// Process each category type (industries, products)
async function processCategories() {
  const categoryTypes = ['industries', 'products'];
  
  for (const categoryType of categoryTypes) {
    const categories = data[categoryType] || {};
    
    for (const [categoryName, categoryData] of Object.entries(categories)) {
      const assetTypes = ['actions', 'topics', 'agents'];
      
      for (const assetType of assetTypes) {
        const assets = categoryData[assetType] || {};
        
        for (const [fileName, assetData] of Object.entries(assets)) {
          if (assetData.sourceFile || (assetData.dependencies && assetData.dependencies.length)) {
            await createAssetZip(categoryType, categoryName, assetType, fileName.replace('.json', ''), assetData);
          }
        }
      }
    }
  }
}

// Create a zip file for each asset
async function createAssetZip(categoryType, categoryName, assetType, fileName, assetData) {
  try {
    const zip = new JSZip();
    
    // Helper to rewrite asset paths from 'XXX/main' to 'force-app/main'
    function rewriteAssetPath(assetPath) {
      // Match 'industries/XXX/main' or 'products/XXX/main' and replace with 'force-app/main'
      const regex = /^(industries|products)\/([^\/]+)\/main(.*)$/;
      const match = assetPath.match(regex);
      if (match) {
        return 'force-app/main' + match[3];
      }
      return assetPath;
    }

    // Add the source file if it exists
    if (assetData.sourceFile) {
      try {
        const sourcePath = path.join(baseDir, assetData.sourceFile);
        if (fs.existsSync(sourcePath)) {
          if (fs.statSync(sourcePath).isDirectory()) {
            // Add entire directory, rewriting paths
            addDirectoryToZip(zip, sourcePath, rewriteAssetPath(assetData.sourceFile));
          } else {
            const content = fs.readFileSync(sourcePath, 'utf-8');
            zip.file(rewriteAssetPath(assetData.sourceFile), content);
          }
        }
      } catch (error) {
        console.error(`Error adding source file ${assetData.sourceFile}:`, error);
      }
    }

    // Add dependencies if they exist
    if (assetData.dependencies && Array.isArray(assetData.dependencies)) {
      for (const dependency of assetData.dependencies) {
        try {
          const dependencyPath = path.join(baseDir, dependency);
          if (fs.existsSync(dependencyPath)) {
            if (fs.statSync(dependencyPath).isDirectory()) {
              addDirectoryToZip(zip, dependencyPath, rewriteAssetPath(dependency));
            } else {
              const content = fs.readFileSync(dependencyPath, 'utf-8');
              zip.file(rewriteAssetPath(dependency), content);
            }
          }
        } catch (error) {
          console.error(`Error adding dependency ${dependency}:`, error);
        }
      }
    }
    
    // Generate the zip file
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Create the output path with a structure that matches the asset path
    const outputFilePath = path.join(outputDir, `${categoryType}_${categoryName}_${assetType}_${fileName}.zip`);
    
    // Save the zip file
    fs.writeFileSync(outputFilePath, zipContent);
    console.log(`Created asset bundle for ${categoryType}/${categoryName}/${assetType}/${fileName}`);
  } catch (error) {
    console.error(`Error creating zip for ${fileName}:`, error);
  }
}

// Helper function to recursively add a directory to the zip
function addDirectoryToZip(zip, dirPath, zipPath) {
  const items = fs.readdirSync(dirPath);
  
  // Helper to rewrite asset paths from 'XXX/main' to 'force-app/main'
  function rewriteAssetPath(assetPath) {
    const regex = /^(industries|products)\/([^\/]+)\/main(.*)$/;
    const match = assetPath.match(regex);
    if (match) {
      return 'force-app/main' + match[3];
    }
    return assetPath;
  }
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const zipItemPath = path.join(zipPath, item);
    const rewrittenZipItemPath = rewriteAssetPath(zipItemPath);
    if (fs.statSync(itemPath).isDirectory()) {
      addDirectoryToZip(zip, itemPath, rewrittenZipItemPath);
    } else {
      const content = fs.readFileSync(itemPath);
      zip.file(rewrittenZipItemPath, content);
    }
  }
}

// Run the script
processCategories()
  .then(() => console.log('Asset bundle generation complete!'))
  .catch(error => console.error('Error generating asset bundles:', error));
