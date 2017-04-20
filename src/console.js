const fs = require('fs');
const path = require('path');
const program = require('commander');
const utils = require('./utils');

const DIR = path.join(__dirname, 'generators');
const DEFAULT_OUT = path.join(__dirname, '..', 'tmp');
const E_WRONG_ALG = 'Invalid algorithms name. Check supported section.';

(function() {
  process.on('exit', err => {
    if (!!err && typeof err === 'string') {
      console.error('\r\n' + err);
      program.help();
    }
  });

  program.version('0.0.1')
    .description(`Supported algorithms and languages: \r\n\t${getSupportedGenerators()}`)
    .option('-a, --algorithm <algorithm>', 'multiplier algorithm', 'reih-maz')
    .option('-l, --language <language>', 'language for output code', 'c_def')
    .option('-n, --name <name>', 'name for output file', 'out')
    .option('-o, --out <absolute path>', 'path for output folder', DEFAULT_OUT)
    .option('-p, --polynomial <polynomial>', 'monic irreducible polynomial base 2. REQUIRED')
    .parse(process.argv);

  if (!program.polynomial) {
    process.exit('ERROR: No polynomial provided.');
  }

  const { language, algorithm, name, out, polynomial } = program;
  const fileName = utils.resolveFilename(language, name);

  try {
    fs.mkdirSync(`${out}`);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      process.exit(err.code);
    }
  }

  const file = path.join(out, fileName);
  try {
    const builder = loadModule(algorithm);
    const result = builder(polynomial, language);
    fs.writeFileSync(file, result);
    console.log('Done');
  } catch (err) {
    process.exit(err.message);
  }

}());

function getSupportedGenerators() {
  return fs.readdirSync(DIR).filter(file => fs.lstatSync(path.join(DIR, file)).isDirectory()).map(algorithm => getSupprotedLanguages(algorithm)).join(',\r\n\t\t');
};

function getSupprotedLanguages(dirName) {
  return `${dirName}: [${fs.readdirSync(path.join(DIR, dirName)).map(lang => lang.replace(/.js$/, '')).join(', ')}]`;
};

function loadModule(algorithm) {
  try {
    const filePath = path.join(__dirname, 'generators', algorithm, 'index.js');
    return require(filePath);
  } catch (err) {
    console.log(err);
    throw new Error(E_WRONG_ALG);
  }
};
