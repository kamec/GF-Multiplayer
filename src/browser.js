const python = require('codemirror/mode/python/python');
const verilog = require('codemirror/mode/verilog/verilog');
const pascal = require('codemirror/mode/pascal/pascal');
const c_def = require('codemirror/mode/clike/clike');
const codeMirror = require('codemirror');

const library = require('./generators/generators.json');
const locales = require('./locales.json');
const utils = require('./utils');

const selLocale = document.querySelector('.select--locale');
const selAlg = document.querySelector('.select--algorithm');
const selLang = document.querySelector('.select--language');
const input = document.querySelector('.input--polynomial');
const btnGenerate = document.querySelector('.button--generate');
const btnClear = document.querySelector('.button--clear');
const btnDownload = document.querySelector('.button--download');
const linkReference = document.querySelector('.reference-link');

let E_WRONG_INPUT = '';

let defLocale = window.localStorage.getItem('defLocale') || locales[navigator.language.slice(0, 2)] || 'en';
changeLocale(defLocale);

const output = codeMirror.fromTextArea(document.querySelector('.generated-code'), {
  theme: 'icecoder',
  readOnly: true,
  matchBrackets: true,
  linewrapping: false,
  lineNumbers: true,
  cursorBlinkRate: -1,
  tabSize: 2,
});

const generators = library.supported;
selAlg.onchange = handleAlgirithmSelection;

generators.forEach(gen => initializeMultSelect(selAlg, gen));
btnGenerate.onclick = generateCode;
btnClear.onclick = clearOut;

initializeLocaleSelect(selLocale, locales, defLocale);

function clearOut() {
  output.setValue('');
  btnClear.disabled = true;
  btnDownload.disabled = true;
}

function handleAlgirithmSelection(event) {
  const algorithm = event.target.value;
  const supported = generators.find(alg => alg.name === algorithm).supported
  initializeLangSelect(selLang, supported);
}

function initializeMultSelect(select, generator) {
  const option = createOption(generator.name);
  select.appendChild(option);
}

function initializeLangSelect(select, langs) {
  select.innerHTML = '';
  langs.forEach(opt => select.appendChild(createOption(opt.name)));
}

function initializeLocaleSelect(select, locales, defLocale) {
  select.innerHTML = '';
  select.onchange = event => changeLocale(event.target.value, defLocale);

  Object.keys(locales).forEach(locale => {
    select.appendChild(createOption(locale));
    if (locale === defLocale) {
      select.value = locale;
    }
  });
}

function createOption(content) {
  const option = document.createElement('option');
  option.innerHTML = content;
  option.value = content;
  return option;
}

function generateCode() {
  const algIdx = selAlg.selectedIndex;
  const langIdx = selLang.selectedIndex;

  if (algIdx === -1 || langIdx === -1) {
    output.setValue(E_WRONG_INPUT);
    return;
  }

  const generatorAlg = selAlg.options[algIdx].value;
  const builder = require(`./generators/${generatorAlg}/index.js`);
  const lang = selLang.options[langIdx].value;

  try {
    const mode = /^c_|java|matrix/.test(lang) ? 'clike' : lang;
    output.setOption('mode', mode);
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
  downloadLink.download = utils.resolveFilename(lang);
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = event => document.body.removeChild(event.target);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

function changeLocale(locale, defLocale) {
  if (defLocale !== undefined) defLocale = locale;

  window.localStorage.setItem('defLocale', locale);

  const { header, selectLoc, selectAlg, selectLang, inputPoly, btnGen, btnClr, btnDwnl, linkRef, errInput } = locales[locale];

  document.querySelector('.main--header').textContent = header;
  document.querySelector('.label--locale').textContent = selectLoc;
  document.querySelector('.label--algorithm').textContent = selectAlg;
  document.querySelector('.label--language').textContent = selectLang;
  document.querySelector('.label--polynomial').textContent = inputPoly;
  document.querySelector('.button--generate').textContent = btnGen;
  document.querySelector('.button--clear').textContent = btnClr;
  document.querySelector('.button--download').textContent = btnDwnl;

  const reference = document.querySelector('.link--reference')
  reference.textContent = linkRef;
  reference.href = `/reference/${locale}/index.html`;

  E_WRONG_INPUT = errInput;
}
