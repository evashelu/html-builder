const fs = require('fs/promises');
const path = require('path');

async function displayFile () {
  try {
    const filePath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(filePath, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isFile()) {
        const filePath2 = path.join(filePath, file.name);
        const stats = await fs.stat(filePath2);
        const fileSize = (stats.size / 1024).toFixed(3);
        const fileExtension = path.extname(file.name).slice(1);

        console.log(`${path.basename(file.name, path.extname(file.name))} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

displayFile();