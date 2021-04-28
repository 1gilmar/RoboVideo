const algoritimia = require('algorithmia')
const algoritimoApiKey = require('../credentials.json').apiKey
const sentencaboundaydetection = require('sbd')

// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Michael+Jackson
// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Michael+Jackson

async function robot(contexto) {
	// console.log(`Recebi com sucesso o contexto ${contexto.searchTerm}`);
	await fetchContentFromWikipedia(contexto)
	await sanitizeContent(contexto)
	await breakContentIntoSentences(contexto)

	async function fetchContentFromWikipedia(contexto) {
		//* retorn funcao asincrona
		// return 'TESTANDO RETORNO DA FUNCAO ASYNC'
		var input = {
			"articleName": "AI Winter",
			"lang": "en"
		};

		const algoAutenticacao = algoritimia(algoritimoApiKey)
		const wikepediaAlgo = algoAutenticacao.algo('web/WikipediaParser/0.1.2')
		const wikepediaResponde = await wikepediaAlgo.pipe(contexto.searchTerm)
		const wikepediaContent = wikepediaResponde.get()

		contexto.sourceContentOriginal = wikepediaContent.content
	}

	function sanitizeContent(contexto) {
		const semLinhaBrancaEMarkDown= removerLinhaBrancaEMarkDown(contexto.sourceContentOriginal)
		const semDataComParenteses = removeDataComParenteses(semLinhaBrancaEMarkDown)
		
		contexto.sourceContentSanitized = semDataComParenteses

		function removerLinhaBrancaEMarkDown(texto) {
			const allLinha = texto.split('\n')

			const removerLinhaBrancaEMarkDown = allLinha.filter((linha) => {
				if (linha.trim().length === 0 || linha.trim().startsWith('=')) {
					return false
				}
				return true
			})

			return removerLinhaBrancaEMarkDown.join(' ')
		}
	}

	function removeDataComParenteses(texto){
		return texto.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
	}

	function breakContentIntoSentences(contexto){
		contexto.sentences = []

		const sentenca = sentencaboundaydetection.sentences(contexto.sourceContentSanitized)
		sentenca.forEach((sentence)=>{
			contexto.sentences.push({
				text: sentence,
				keyworkds: [],
				images: []
			})
		})
	}

}

module.exports = robot