const fs = require('fs');
const path = require('path');
const builder = require('./matrixBuilder');
const utils = require('./utils');

const EWRONGTYPE = 'Invalid polynomial basis type. Only ESP, trinomials and pentanomials are supported.';

process.on('exit', err => {
  if (err !== 0 && err) {
    console.log(err)
  }
});

const args = process.argv.slice(2);
const opts = parseArgs(args);
fs.mkdir(`${opts.path}`, err => {
  if (err && err.code !== 'EEXIST') {
    process.exit(err);
  }

  const file = path.join(opts.path, opts.fileName);
  const Q = builder.initReductionMatrix(opts.p);
  if (Q.length === 0) {
    process.exit(EWRONGTYPE);
  }
  const size = Q[0].length;
  fs.writeFile(file, loadMultiplier(opts.mult, opts.lang)(utils.prepareMatrix(Q), size), err => {
    if (err) {
      process.exit(err);
    } else {
      console.log('Done');
    }
  });
});

function parseArgs(args) {
  if (isHelpNeeded(args) || isWrongParameters(args)) {
    printHelp();
    process.exit();
  }

  const flags = args.reduce((map, key, idx, arr) => {
    if (idx % 2 === 0) {
      map[key.slice(1, 2)] = arr[idx + 1];
    }
    return map;
  }, {});

  const opts = {};

  opts.p = flags.p;
  opts.path = flags.o || path.join(__dirname, '..', 'tmp');
  opts.lang = flags.g || 'c_def';
  opts.mult = flags.m || 'reih-maz';
  opts.fileName = resolveFilename(opts.lang, flags.n);

  return opts;
};

function loadMultiplier(generatorName, fileName) {
  const filePath = path.join(__dirname, 'generators', generatorName, fileName + '.js');
  if (fs.lstatSync(filePath)) {
    return require(filePath);
  }
};

function isHelpNeeded(args) {
  return args.length === 0 || args.indexOf('-h') !== -1;
};

function isWrongParameters(args) {
  return args.indexOf('-p') === -1 || args.length % 2 !== 0;
};

function printHelp() {
  let helpMessage = `USAGE:\r\n\tnode index.js [-h] [[-o | -out] <string>] [[-n | -name] <string>] [[-g | -generate] <string>] [[-m | -multiplier] <string>] [-p | -polynomial] <number>\r\n`;
  helpMessage += `\t-h\t\t\t\t--print this message;\r\n`;
  helpMessage += `\t-o | -out <absolute path>\t--path for output folder;\r\n`;
  helpMessage += `\t-n | -name <custom name>\t--name for output file;\r\n`;
  helpMessage += `\t-g | -generate <language>\t--language for output code;\r\n`;
  helpMessage += `\t-m | -multiplier <algorithm>\t--multiplier algorithm;\r\n`;
  helpMessage += `\t-p | -polynomial <polynomial>\t--monic irreducible polynomial base 2;\r\n`;
  helpMessage += `\tSUPPORTED LANGUAGES: (\r\n\t\t${getAvaibleOptions()}\r\n\t)\r\n`;
  helpMessage += `\tEXAMPLE:\r\n`;
  helpMessage += `\t\tnode index.js -o D:\\tmp\\ -n result -m reih-maz -p 1010101\r\n`;
  console.log(helpMessage);
};

function getAvaibleOptions() {
  const DIR = path.join(__dirname, 'generators');
  return fs.readdirSync(DIR).filter(file => fs.lstatSync(path.join(DIR, file)).isDirectory()).map(mult => getSupprotedLanguages(mult)).join(',\r\n\t\t');
};

function getSupprotedLanguages(dir) {
  return `${dir}: [${fs.readdirSync(path.join(__dirname, 'generators', dir)).map(lang => lang.replace(/.js$/, '')).join(', ')}]`;
};

function resolveFilename(lang, name) {
  return (lang === 'java') ? 'Generator.java' : `${name || 'out'}.${resolveExtension(lang)}`;
};

function resolveExtension(lang) {
  const extensions = {
    c_def: 'c',
    c_func: 'c',
    python: 'py',
    pascal: 'pas',
    matrix: 'txt',
    verilog: 'v',
  };

  return extensions[lang.toLowerCase()] || '';
};
