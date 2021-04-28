const readLine = require('readline-sync')
const robots = {
  // userInput: require('./robots/user-input.js'),
  texto: require('./robots/text.js')
};

async function start() {
  const content = {
    maximumSentences: 7
  }

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  content.lang = askLang()

  await robots.texto(content)

  function askAndReturnSearchTerm() {
    return readLine.question('Digite termo de busca: ')
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readLine.keyInSelect(prefixes, 'Selecion uma opção: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex];

    return selectedPrefixText
  }

  function askLang(){
    const lang = ['en', 'pt']
    const lingua = readLine.keyInSelect(lang,'Selecionar uma linguagem: ')
    const linguaSelecionada = lang[lingua]
    return linguaSelecionada
  }

  console.log(content)

}

start()