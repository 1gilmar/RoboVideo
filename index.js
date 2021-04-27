const readLine = require('readline-sync')

function start(){
  const content = {}

  content.searchTerm = askAddReturnSearchTerm()

  function askAddReturnSearchTerm(){
    return readLine.question('Digite termo de busca: ')
  }

  console.log(content)

}

start()