const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'src/generators');
const OUT = path.join(__dirname, 'src/config/generators.json');

fs.writeFileSync(OUT, JSON.stringify(getDirectoryContent(DIR, 'generators')));

function getDirectoryContent(dirPath, dir) {
  const result = {
    name: dir,
    supported: []
  };
  fs.readdirSync(dirPath).forEach(fileName => {
    if (/(^index)|(.json$)/.test(fileName)) {
      return;
    }
    const nextPath = path.join(dirPath, fileName);
    if (fs.lstatSync(nextPath).isFile()) {
      result.supported.push({ name: fileName.replace(/\.js$/g, '') });
    } else {
      result.supported.push(getDirectoryContent(nextPath, fileName));
    }
  });
  return result;
}
