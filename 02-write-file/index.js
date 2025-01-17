const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const outputStream = fs.createWriteStream(filePath, { flags: 'a'});

console.log('Welcome! Enter text or type "exit" to quit.');

const rl = readline.createInterface({ 
  input: process.stdin,
  output: process.stdout,
});

const handleInput = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye');
    rl.close();
    outputStream.end();
    return;
  }

  outputStream.write(input + '\n');
  console.log('Text written to file. Enter more text or type "exit" to quit');
  };

rl.on('line', handleInput);

process.on('SIGINT', () => {
  console.log('Goodbye!');
  rl.close();
  outputStream.end();
  process.exit();
});