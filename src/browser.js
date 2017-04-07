const library = require('../tmp/generators.json');
const builder = require('./matrixBuilder');
const utils = require('./utils');

const selMult = document.querySelector('.select--multiplier');
const selLang = document.querySelector('.select--language');
const btnGenerate = document.querySelector('.button--generate');
const btnDownload = document.querySelector('.button--download');
const input = document.querySelector('.input--polynomial');
const output = document.querySelector('.generated-code');


const generators = library.supported;
selMult.onchange = handle;
generators.forEach(gen => initializeMultSelect(selMult, gen));
console.log(btnDownload);

btnGenerate.onclick = generateCode;

function handle(event) {
  const val = event.target.value;
  initializeLangSelect(selLang, generators.find(alg => alg.name === val).supported);
}

function initializeMultSelect(select, generator) {
  const option = createOption(generator.name);
  select.appendChild(option);
}

function initializeLangSelect(select, langs) {
  select.innerHTML = '';
  langs.forEach(opt => {
    select.appendChild(createOption(opt.name));
  });
}

function createOption(content) {
  const option = document.createElement('option');
  option.innerHTML = content;
  option.value = content;
  return option;
}

function generateCode() {
  const multIdx = selMult.selectedIndex;
  const langIdx = selLang.selectedIndex;

  if (multIdx === -1 || langIdx === -1 || isNaN(parseInt(input.value, 2))) {
    return;
  }

  const generatorAlg = selMult.options[multIdx].value;
  const lang = selLang.options[langIdx].value;
  const Q = builder.initReductionMatrix(input.value);

  if (Q.length === 0) {
    output.textContent = 'ERROR: Invalid polynomial basis type. Only ESP, trinomials and pentanomials are supported.';
    return;
  }

  const size = Q[0].length;

  const generator = require(`./generators/${generatorAlg}/${lang}.js`);
  output.textContent = generator(utils.prepareMatrix(Q), size);
  btnDownload.disabled = false;
  btnDownload.onclick = saveTextAsFile;
}

function saveTextAsFile() {
  const langIdx = selLang.selectedIndex;

  const textToWrite = output.textContent;
  const textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
  const fileNameToSaveAs = resolveFilename(selLang.options[langIdx].value);

  const downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = event => document.body.removeChild(event.target);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

function resolveFilename(lang) {
  return (lang === 'java') ? 'Generator.java' : `output.${resolveExtension(lang)}`;
};

function resolveExtension(lang) {
  const extensions = {
    c_def: 'c',
    c_func: 'c',
    pascal: 'pas',
    plain: 'txt',
    python: 'py',
    verilog: 'v',
  };

  return extensions[lang];
}
