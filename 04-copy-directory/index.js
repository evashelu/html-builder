const fs = require('fs');
const path = require('path');

const copyDirectory = async () => {
  const sourceDirectory = path.join(__dirname, 'files');
  const desDirectory = path.join(__dirname, 'files-copy');

  await fs.promises.mkdir(desDirectory, { recursive: true });

  const files = await fs.promises.readdir(sourceDirectory);

  await Promise.all(files.map(async (file) => {
    const srcFile = path.join(sourceDirectory, file);
    const destFile = path.join(desDirectory, file);

    const stats = await fs.promises.stat(srcFile);
    if (stats.isFile()) {
      await fs.promises.copyFile(srcFile, destFile);
      console.log(`Coppied ${file} to ${desDirectory}`)
    }
  }));

  console.log('Directory copied succesfully!');
};

copyDirectory().catch(err => console.error('Error copying directory:', err));