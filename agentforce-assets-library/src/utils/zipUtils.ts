'use client';

import { saveAs } from 'file-saver';
import { ActionFile } from '@/types';

/**
 * Downloads a pre-generated zip file containing the asset source file and its dependencies
 * 
 * @param asset The asset data containing category, categoryName, assetType, and fileName
 * @param assetName The name of the asset for user-friendly display
 */
export async function downloadAssetFiles(asset: ActionFile, assetName: string) {
  if (!asset.category || !asset.categoryName || !asset.assetType || !asset.fileName) {
    console.error('Missing asset path information');
    return false;
  }
  
  try {
    // Construct the path to the pre-generated zip file
    const zipPath = `/generated/assets/${asset.category}_${asset.categoryName}_${asset.assetType}_${asset.fileName}.zip`;
    
    // Fetch the pre-generated zip file
    const response = await fetch(zipPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset bundle: ${response.statusText}`);
    }
    
    // Get the zip file as a blob
    const zipBlob = await response.blob();
    
    // Trigger download with a user-friendly name
    const sanitizedAssetName = assetName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    saveAs(zipBlob, `${sanitizedAssetName}_asset.zip`);
    
    return true;
  } catch (error) {
    console.error('Error downloading asset bundle:', error);
    return false;
  }
}
