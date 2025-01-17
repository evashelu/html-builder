const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

const mergeStyles = async () => {
    const cssContent = [];

    try {
        const files = await fs.readdir(stylesDir);

        for (const file of files) {
            const filePath = path.join(stylesDir, file);
            const fileStat = await fs.stat(filePath);

            if (fileStat.isFile() && path.extname(file) === '.css') {
                const content = await fs.readFile(filePath, 'utf-8');
                cssContent.push(content);
                console.log(`Added file: ${filePath}`);
            }
        }

        await fs.writeFile(outputFile, cssContent.join('\n'), 'utf-8');
        console.log('Styles merged successfully into bundle.css!');
    } catch (error) {
        console.error('Error merging styles:', error);
    }
};

mergeStyles();