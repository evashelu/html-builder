const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bigAll.css');

const mergeStyles = async (dir) => {
  try {
    const files = await fs.promises.readdir(dir);
    const cssAllContent = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileStat = await fs.promises.stat(filePath);

      if (fileStat.isDirectory()) {
        const nestedContent = await mergeStyles(filePath);
        cssAllContent.push(...nestedContent);
      } else if (fileStat.isFile() && path.extname(file) === '.css') {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        cssAllContent.push(content);
        console.log(`Added file: ${(filePath)}`);
      }
    }

    return cssAllContent;
  } catch (error) {
    console.error('Error merging styles:', error);
    return [];
  }
};

const integrationStyles = async () => {
  try {
    console.log('Running styles merging...');
    await fs.promises.mkdir(outputDir, { recursive: true });
    const allCssContent = await mergeStyles(stylesDir);
    await fs.promises.writeFile(outputFile, allCssContent.join('\n'), 'utf-8');
    console.log('Styles merged successfully into bigAll.css!');
  } catch (error) {
    console.error('Error merging styles:', error);
  }
};

integrationStyles();