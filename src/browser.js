const json = require('../tmp/generators.json');
const selMult = document.querySelector('.select--multiplier');
selMult.onchange = handle;
const selLang = document.querySelector('.select--language');

json.supported.forEach(gen => initializeMultSelect(selMult, gen));

function initializeMultSelect(select, generator) {
  const option = createOption(generator.name);
  select.appendChild(option);
  // initializeLangSelect(selLang, generator.supported);
}

function initializeLangSelect(select, langs) {
  select.innerHTML = '';
  langs.forEach(opt => {
    select.appendChild(createOption(opt));
  })
}

function createOption(content) {
  const option = document.createElement('option');
  option.innerHTML = content;
  option.value = content;
  return option;
}

function handle(event) {
  const val = event.target.value;
  console.log(val);
  console.log(json.supported.filter(alg => alg.name === val));
  initializeLangSelect(selLang, json.supported.filter(alg => alg.name === val).pop().supported)
}
