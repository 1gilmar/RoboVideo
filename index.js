const readLine = require('readline-sync')

function start(){
  const content = {}

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()

  function askAndReturnSearchTerm(){
    return readLine.question('Digite termo de busca: ')
  }

  function askAndReturnPrefix(){
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readLine.keyInSelect(prefixes, 'Selecion uma opção: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex];

    return selectedPrefixText
  }

  console.log(content)

}

start()