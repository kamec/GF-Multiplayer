const generators = require('./config/generators.json').supported;
const locales = require('./config/locales.json');
const { resolveFilename } = require('./utils');

const selAlg = document.querySelector('.select--algorithm');
const selLang = document.querySelector('.select--language');
const selLocale = document.querySelector('.select--locale');
const input = document.querySelector('.input--polynomial');
const btnClear = document.querySelector('.button--clear');
const btnDownload = document.querySelector('.button--download');
const btnGenerate = document.querySelector('.button--generate');
const btnReference = document.querySelector('.button--reference');
const linkReference = document.querySelector('.reference');

const codeMirrorOptions = require('./config/codeMirrorOptions.json');
const output = CodeMirror.fromTextArea(document.querySelector('.generated-code'), codeMirrorOptions);

const localStorageLocale = window.localStorage.getItem('locale');
const browserLocale = navigator.language.slice(0, 2);
const defaultLocale = 'en';
const locale = localStorageLocale || browserLocale || defaultLocale;

let E_WRONG_INPUT = '';

(function() {
  changeLocale(locale);
  initializeLocaleSelect(selLocale, locales, locale);

  selAlg.onchange = handleAlgirithmSelection;

  btnReference.onclick = show;
  
  generators.forEach(gen => initializeMultSelect(selAlg, gen));
  btnGenerate.onclick = generateCode;
  btnClear.onclick = clearOut;
}());

function show() {
  btnReference.onclick = hide;
  linkReference.classList.remove('hidden');
}

function hide() {
  btnReference.onclick = show;
  linkReference.classList.add('hidden');
}

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
  select.onchange = event => changeLocale(event.target.value);

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

  let mode;
  
  switch (lang) {
    case 'c_def':
    case 'c_func':
      mode = 'text/x-csrc';
      break;
      
    case 'java':
      mode = 'text/x-java';
      break;

    default:
      mode = lang;
      break;
  }

  try {
    output.setValue(builder(input.value, lang));
    output.setOption('mode', mode);
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
  downloadLink.download = resolveFilename(lang);
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.onclick = event => document.body.removeChild(event.target);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

function changeLocale(locale) {
  window.localStorage.setItem('locale', locale);

  const { header, selectLoc, selectAlg, selectLang, inputPoly, inputTitle, btnGen, btnClr, btnDwnl, ref, errInput } = locales[locale];

  document.querySelector('.main--header').textContent = header;
  document.querySelector('.label--locale').textContent = selectLoc;
  document.querySelector('.label--algorithm').textContent = selectAlg;
  document.querySelector('.label--language').textContent = selectLang;
  document.querySelector('.label--polynomial').textContent = inputPoly;
  document.querySelector('.input--polynomial').title = inputTitle;
  document.querySelector('.button--generate').textContent = btnGen;
  document.querySelector('.button--clear').textContent = btnClr;
  document.querySelector('.button--download').textContent = btnDwnl;
  document.querySelector('.button--reference').textContent = ref;
  document.querySelector('.reference').src = `/reference/${locale}/index.html`;

  E_WRONG_INPUT = errInput;
}
