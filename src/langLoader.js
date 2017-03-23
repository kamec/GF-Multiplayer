const fs = require('fs');
const pathModule = require('path');
const DIR = pathModule.join(__dirname, 'generators');

function loadModule(filename) {
  const path = pathModule.join(DIR, filename + '.js');
  if (fs.lstatSync(path)) {
    return require(path);
  }
}

module.exports = loadModule;
