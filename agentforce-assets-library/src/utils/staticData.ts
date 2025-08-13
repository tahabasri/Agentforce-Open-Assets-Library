// Function to load the static data generated during build time
export async function getStaticData() {
  try {
    // For server-side usage
    if (typeof window === 'undefined') {
      // Import fs and path modules only on server-side
      const fs = await import('fs');
      const path = await import('path');
      
      const dataPath = path.default.join(process.cwd(), 'public', 'generated', 'data.json');
      const jsonData = fs.default.readFileSync(dataPath, 'utf8');
      return JSON.parse(jsonData);
    } 
    // For client-side usage
    else {
      const response = await fetch('/generated/data.json');
      if (!response.ok) {
        throw new Error(`Error loading static data: ${response.status}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Error loading static data:', error);
    return { industries: {}, products: {} };
  }
}

// Load static paths for generateStaticParams
export async function getStaticPaths() {
  try {
    // For server-side usage
    if (typeof window === 'undefined') {
      // Import fs and path modules only on server-side
      const fs = await import('fs');
      const path = await import('path');
      
      const pathsFile = path.default.join(process.cwd(), 'public', 'generated', 'staticPaths.json');
      const jsonData = fs.default.readFileSync(pathsFile, 'utf8');
      return JSON.parse(jsonData);
    } 
    // For client-side usage (not typically needed, but included for completeness)
    else {
      const response = await fetch('/generated/staticPaths.json');
      if (!response.ok) {
        throw new Error(`Error loading static paths: ${response.status}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Error loading static paths:', error);
    return [];
  }
}
