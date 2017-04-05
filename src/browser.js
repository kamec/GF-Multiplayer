const library = require('../public/generators.json');
const builder = require('./matrixBuilder');
const selMult = document.querySelector('.select--multiplier');
const selLang = document.querySelector('.select--language');
const btn = document.querySelector('.button--generate');
const input = document.querySelector('.input--polynomial');
const output = document.querySelector('.generated-code');

const generators = library.supported;
selMult.onchange = handle;
generators.forEach(gen => initializeMultSelect(selMult, gen));

btn.onclick = generateCode;


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
  let gen = require(`bundle-loader!./generators/${generatorAlg}/${lang}.js`);
  gen(function(generator) {
    output.textContent = generator(Q);
  });

}
