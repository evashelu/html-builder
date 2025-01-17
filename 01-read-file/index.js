const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(filePath, { encoding: 'utf8'});

stream.pipe(process.stdout);

stream.on('error', (err) => {
  console.error('error readong the file:', err);
});