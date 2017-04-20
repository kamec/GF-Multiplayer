const python = require('codemirror/mode/python/python');
const verilog = require('codemirror/mode/verilog/verilog');
const pascal = require('codemirror/mode/pascal/pascal');
const c_def = require('codemirror/mode/clike/clike');
const codeMirror = require('codemirror');

const library = require('./generators/generators.json');
const utils = require('./utils');

const selMult = document.querySelector('.select--multiplier');
const selLang = document.querySelector('.select--language');
const btnGenerate = document.querySelector('.button--generate');
const btnClear = document.querySelector('.button--clear');
const btnDownload = document.querySelector('.button--download');
const input = document.querySelector('.input--polynomial');

let output = codeMirror.fromTextArea(document.querySelector('.generated-code'), {
  theme: 'icecoder',
  readOnly: true,
  matchBrackets: true,
  linewrapping: false,
  lineNumbers: true,
  cursorBlinkRate: -1,
  tabSize: 2,
});

const E_WRONG_INPUT = 'ERROR: Check your inputs.\r\n\tYou should choose algorithm and language for generated code.\r\n\tPolinomial should be provided only in binary representation.';

const generators = library.supported;
selMult.onchange = handle;

generators.forEach(gen => initializeMultSelect(selMult, gen));
btnGenerate.onclick = generateCode;
btnClear.onclick = () => {
  output.setValue('');
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
    output.setValue(E_WRONG_INPUT);
    return;
  }
  const generatorAlg = selMult.options[multIdx].value;
  const lang = selLang.options[langIdx].value;
  const builder = require(`./generators/${generatorAlg}/index.js`);
  try {
    if (/^c_|java|matrix/.test(lang)) {
      output.setOption('mode', 'clike');
    } else {
      output.setOption('mode', lang);
    }
    output.setValue(builder(input.value, lang));
  } catch (e) {
    output.setValue(e.message);
  }
  btnClear.disabled = false;
  btnDownload.disabled = false;
  btnDownload.onclick = saveTextAsFile.bind(this, lang);
}

function saveTextAsFile(lang) {
  const textFileAsBlob = new Blob([output.getValue()], {
    type: 'text/plain'
  });
  const downloadLink = document.createElement('a');
  downloadLink.download = utils.resolveFilename(lang);;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = event => document.body.removeChild(event.target);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}
