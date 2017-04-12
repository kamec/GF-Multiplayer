const library = require('./generators/generators.json');
const utils = require('./utils');

const selMult = document.querySelector('.select--multiplier');
const selLang = document.querySelector('.select--language');
const btnGenerate = document.querySelector('.button--generate');
const btnClear = document.querySelector('.button--clear');
const btnDownload = document.querySelector('.button--download');
const input = document.querySelector('.input--polynomial');
const output = document.querySelector('.generated-code');

const E_WRONG_INPUT = 'ERROR: Check your inputs.\r\n\tYou should choose algorithm and language for generated code.\r\n\tPolinomial should be provided only in binary representation.';

const generators = library.supported;
selMult.onchange = handle;
generators.forEach(gen => initializeMultSelect(selMult, gen));

btnGenerate.onclick = generateCode;

btnClear.onclick = () => {
  output.textContent = '';
  btnClear.disabled = true;
  btnDownload.disabled = true;
};

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

  if (multIdx === -1 || langIdx === -1) {
    output.textContent = E_WRONG_INPUT;
    return;
  }

  const generatorAlg = selMult.options[multIdx].value;
  const lang = selLang.options[langIdx].value;
  const builder = require(`./generators/${generatorAlg}/index.js`);

  try {
    output.textContent = builder(input.value, lang);
  } catch(e) {
    output.textContent = e.message;
  }
  btnClear.disabled = false;
  btnDownload.disabled = false;
  btnDownload.onclick = saveTextAsFile.bind(this, lang);
}

function saveTextAsFile(lang) {
  const textFileAsBlob = new Blob([output.textContent], { type: 'text/plain' });

  const downloadLink = document.createElement('a');
  downloadLink.download = utils.resolveFilename(lang);;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = event => document.body.removeChild(event.target);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);

  downloadLink.click();
}
