const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'generators');
const OUT = path.join(__dirname, '..', 'tmp', 'generators.json');

fs.writeFile(OUT, JSON.stringify(getDirectoryContent(DIR, 'generators')), e => console.error());

function getDirectoryContent(dirPath, dir) {
  const result = {
    name: dir,
    supported: []
  };
  fs.readdirSync(dirPath).forEach(file => {
    const nextPath = path.join(dirPath, file);
    if (fs.lstatSync(nextPath).isFile()) {
      result.supported.push({
        name: file.replace(/\.js$/g, '')
      });
    } else {
      result.supported.push(getDirectoryContent(nextPath, file));
    }
  });
  return result;
}

module.exports = getDirectoryContent;
