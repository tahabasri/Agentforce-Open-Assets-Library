/* Base64 encoded noise pattern */
const generateNoisePattern = () => {
  // Function to generate a base64 encoded noise pattern
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    const imageData = ctx.createImageData(200, 200);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.floor(Math.random() * 255);
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = Math.floor(Math.random() * 100); // Semi-transparent
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }
  
  return '';
};

export default generateNoisePattern;
