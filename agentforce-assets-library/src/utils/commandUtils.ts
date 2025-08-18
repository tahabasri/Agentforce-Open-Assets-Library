'use strict';

import { ActionFile } from '@/types';

export function generateDeployCommand(asset: ActionFile, fileName: string, assetType: string): string {
  let command = 'sf project deploy start';

  // Add the main asset command based on type
  if (assetType === 'actions') {
    command += `\n -m 'GenAiFunction: ${fileName}'`;
  } else if (assetType === 'topics') {
    command += `\n -m 'GenAiPlugin: ${fileName}'`;
  }

  // Add dependencies if they exist
  if (asset.dependencies && asset.dependencies.length > 0) {
    asset.dependencies.forEach(dep => {
      // Extract type and name from dependency path
      const match = dep.match(/\.([^.-]+)-meta\.xml$/);
    if (match) {
    const type = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      const nameMatch = dep.match(/\/([^/]+)\.[^.]+(?:-meta\.xml)?$/);
      if (nameMatch) {
        let dependencyName = nameMatch[1];
        dependencyName = dependencyName.replace(/\.flow-meta$/, '');
        command += `\n -m '${type}: ${dependencyName}'`;
      }
    }
    });
  }

  return command;
}
