const fs = require('fs');
const path_module = require('path');
const module_holder = {};

function LoadModules(path, file) {
  if (fs.lstatSync(path).isDirectory()) {
    const files = fs.readdirSync(path);
    const l = files.length;
    let f;
    for (let i = 0; i < l; i++) {
      f = path_module.join(path, files[i]);
      LoadModules(f, files[i]);
    }
  } else {
    module_holder[file.replace(/.js$/, '')] = require(path);
  }
}
const DIR = path_module.join(__dirname, 'generators');
LoadModules(DIR);

module.exports = module_holder;
