const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
	const content = {
		maximumSentences: 10
	}

	content.searchTerm = askAndReturnSearchTerm()
	content.prefix = askAndReturnPrefix()
	content.lang = askLang()

	// console.log(`> testar conteudo ${JSON.stringify(content)}`);
	state.save(content)

	function askAndReturnSearchTerm() {
		return readline.question('Digite o termo de busca a ser buscado na Wikipedia: ')
	}

	function askAndReturnPrefix() {
		const prefixes = ['Who is', 'What is', 'The history of']
		const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Selecione uma opção: ')
		const selectedPrefixText = prefixes[selectedPrefixIndex]

		return selectedPrefixText
	}

	function askLang() {
		const lang = ['pt', 'en', 'es']
		const lingua = readline.keyInSelect(lang, 'Selecione o idioma: ')
		const linguaSelecionada = lang[lingua]
		return linguaSelecionada
	}
}

module.exports = robot