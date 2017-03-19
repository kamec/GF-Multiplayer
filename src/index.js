const fs = require('fs');
const path = require('path');
const generateCode = require('./generators/C_def');
const builder = require('./matrixBuilder');
const loader = require('./langLoader');
// const p = '1000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001';

process.on('exit', err => {
  if (err !== 0 && !err) {
    console.log(err)
  }
});

(function() {
  const args = process.argv.slice(2);
  const opts = parseArgs(args);
  console.log(args, opts, loader);
  fs.mkdir(`${opts.path}`, err => {
    if (err && err.code !== 'EEXIST') {
      process.exit(err);
    }
    fs.writeFile(path.join(opts.path, opts.filename), loader[opts.lang](builder.initReductionMatrix(opts.p)), err => {
      if (err) {
        process.exit(err);
      } else {
        console.log('Done');
      }
    });
  });

  function parseArgs(args) {
    const opts = {};
    if (args.length === 0 || args.indexOf('-h') !== -1 || args.indexOf('-p') === -1 || args.length % 2 !== 0) { // TODO: normalize condition
      printHelp();
      process.exit();
    }

    const flags = args.reduce((acc, curr, idx, arr) => {
      if (idx % 2 === 0) {
        acc[curr.slice(1, 2)] = arr[idx + 1];
      }
      return acc;
    }, {});

    opts.p = flags.p;
    opts.path = flags.o || path.join(__dirname, '..', 'tmp');
    opts.lang = flags.g || 'C_def';
    opts.filename = `Generator.${resolveExtension(opts.lang)}`;

    return opts;
  }

  function printHelp() {
    let helpMessage = `USAGE:\r\n\tnode index.js [-h] [[-o | -out] <string>] [[-g | -generate] <string>] -p | -polynomial <number>\r\n`;
    helpMessage += `\t-h\t\t\t\t--print this message;\r\n`;
    helpMessage += `\t-o | -out <absolute path>\t--path for output folder;\r\n`;
    helpMessage += `\t-g | -generate <language>\t--language for output code;\r\n`;
    helpMessage += `\t\tSUPPORTED LANGUAGES:\t[${getSupprotedLangages()}]\r\n`;
    helpMessage += `\t-p | -polynomial <polynomial>\t--monic irreducible polynomial base 2;\r\n`;
    console.log(helpMessage);
  }

  function getSupprotedLangages() {
    return fs.readdirSync(path.join(__dirname, `generators`)).map(lang => lang.replace(/.js$/, '')).join(', ');
  }

  function resolveExtension(lang) {
    switch (lang) {
      case 'c_def':
      case 'c_func':
        return 'c';
      case 'python':
        return 'py';
      case 'java':
        return 'java'
      case 'pascal':
        return 'pas'
      default:
        return 'txt';
    }
  }
}());
