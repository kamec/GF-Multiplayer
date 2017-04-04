const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'generators');
const OUT = path.join(__dirname, '..', 'tmp', 'generators.json');
let generators = [];

fs.writeFile(OUT, JSON.stringify(getDirectoryContent(DIR, 'generators')), e => console.log);

function getDirectoryContent(dirPath, dir) {
  const result = {name: dir};
  result.supported = [];
  fs.readdirSync(dirPath).forEach(file => {
    const nextPath = path.join(dirPath, file);
    if (fs.lstatSync(nextPath).isFile()) {
      result.supported.push(file.replace(/\.js$/g, ''));
    } else {
      result.supported.push(getDirectoryContent(nextPath, file));
    }
  });
  return result;
}
