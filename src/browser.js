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
  const isBinary = /^1[01]+1$/g;
  const multIdx = selMult.selectedIndex;
  const langIdx = selLang.selectedIndex;

  if (multIdx === -1 || langIdx === -1 || !isBinary.test(input.value)) {
    output.textContent = 'ERROR: Check your inputs.\r\n' +
      '\tYou should choose algorithm and language for generated code.\r\n' +
      '\tPolinomial should be provided only in binary representation.';
    return;
  }

  const generatorAlg = selMult.options[multIdx].value;
  const lang = selLang.options[langIdx].value;
  const Q = builder.initReductionMatrix(input.value);

  if (Q.length === 0) {
    output.textContent = 'ERROR: Invalid polynomial basis type:\r\n' +
      '\tOnly ESP, trinomials and pentanomials are supported.';
    return;
  }

  const size = Q[0].length;

  const generator = require(`./generators/${generatorAlg}/${lang}.js`);
  output.textContent = generator(utils.prepareMatrix(Q), size);
  btnDownload.disabled = false;
  btnDownload.onclick = saveTextAsFile.bind(this, lang);
}

function saveTextAsFile(lang) {
  const textFileAsBlob = new Blob([output.textContent], { type: 'text/plain' });
  const fileNameToSaveAs = utils.resolveFilename(lang);

  const downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = event => document.body.removeChild(event.target);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);

  downloadLink.click();
}
