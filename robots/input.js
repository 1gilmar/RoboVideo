const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
  const content = {
    maximumSentences: 10
  }

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  content.lang = askLang()

  console.log(content, 'vamos ver');
  state.save(content)

  function askAndReturnSearchTerm() {
    return readline.question('Type a Wikipedia search term: ')
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex]

    return selectedPrefixText
  }

  function askLang(){
    const lang = ['pt', 'en']
    const lingua = readline.keyInSelect(lang,'Choose one language: ')
    const linguaSelecionada = lang[lingua]
    return linguaSelecionada
  }

}

module.exports = robot