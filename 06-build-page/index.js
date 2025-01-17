const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
    await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    const template = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');

    const tagRegex = /{{(\w+)}}/g;
    const tags = [...template.matchAll(tagRegex)];

    let result = template;
    for (const tag of tags) {
        const componentName = tag[1];
        const componentPath = path.join(__dirname, 'components', `${componentName}.html`);

        try {
            const componentContent = await fs.readFile(componentPath, 'utf-8');
            result = result.replace(tag[0], componentContent);
        } catch (error) {
            console.error(`Component reading error ${componentName}:`, error);
        }
    }
    await fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), result);
}

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bigAll.css');

const mergeStyles = async (dir) => {
    const cssAllContent = [];
    const files = await fs.readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await fs.stat(filePath);

        if (fileStat.isDirectory()) {
            const nestedContent = await mergeStyles(filePath);
            cssAllContent.push(...nestedContent);
        } else if (fileStat.isFile() && path.extname(file) === '.css') {
            const content = await fs.readFile(filePath, 'utf-8');
            cssAllContent.push(content);
            console.log(`Added file: ${filePath}`);
        }
    }
    return cssAllContent;
};

const integrationStyles = async () => {
    try {
        console.log('Running styles merging...');
        await fs.mkdir(outputDir, { recursive: true });
        const allCssContent = await mergeStyles(stylesDir);
        await fs.writeFile(outputFile, allCssContent.join('\n'), 'utf-8');
        console.log('Styles merged successfully into bigAll.css!');
    } catch (error) {
        console.error('Error merging styles:', error);
    }
};

const copyDirectory = async (sourceDirectory, desDirectory) => {
    await fs.mkdir(desDirectory, { recursive: true });
    const files = await fs.readdir(sourceDirectory);

    await Promise.all(files.map(async (file) => {
        const srcFile = path.join(sourceDirectory, file);
        const destFile = path.join(desDirectory, file);

        const stats = await fs.stat(srcFile);
        if (stats.isDirectory()) {
            await copyDirectory(srcFile, destFile);
            console.log(`Copied directory ${file} to ${desDirectory}`);
        } else {
            await fs.copyFile(srcFile, destFile);
            console.log(`Copied ${file} to ${desDirectory}`);
        }
    }));

    console.log(`Directory copied successfully from ${sourceDirectory} to ${desDirectory}!`);
};

async function main() {
    await buildPage();
    await integrationStyles();
    const sourceDirectory = path.join(__dirname, 'files');
    const desDirectory = path.join(__dirname, 'files-copy');
    await copyDirectory(sourceDirectory, desDirectory);
}

main().catch(console.error);