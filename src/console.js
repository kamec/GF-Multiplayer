const fs = require('fs');
const path = require('path');
const program = require('commander');
const {resolveFilename} = require('./utils');

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

  program.version('0.1.0')
    .description(`Defaults:\r\n\tOutput directory:\t'./tmp/'\r\n\tFile name:\t\t'out'\r\n\tAlgorithm:\t\t'reyhani-masoleh'\r\n\tLanguage:\t\t'c_func'\r\n\r\n  Supported algorithms and languages: \r\n\t${getSupportedGenerators()}\r\n`)
    .option('-a, --algorithm <algorithm>', 'multiplier algorithm', 'reyhani-masoleh')
    .option('-l, --language <language>', 'language for output code', 'c_func')
    .option('-n, --name <name>', 'name for output file', 'out')
    .option('-o, --out <absolute path>', 'path for output folder', DEFAULT_OUT)
    .option('-p, --polynomial <polynomial>', 'monic irreducible polynomial base 2 with big-endian notation. REQUIRED')
    .usage(`-a karatsuba -l pascal -o D://temp/ -p 101010101`)
    .parse(process.argv);

  if (!program.polynomial) {
    process.exit('  ERROR: No polynomial provided.');
  }

  const { language, algorithm, name, out, polynomial } = program;
  const fileName = resolveFilename(language, name);

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
  return fs.readdirSync(DIR).filter(file => fs.lstatSync(path.join(DIR, file)).isDirectory()).map(algorithm => getSupprotedLanguages(algorithm)).join(',\r\n\t');
};

function getSupprotedLanguages(dirName) {
  return `${dirName}: [${fs.readdirSync(path.join(DIR, dirName)).filter(lang => lang !== 'index.js' ).map(lang => lang.replace(/.js$/, '')).join(', ')}]`;
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
