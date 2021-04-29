const algoritimia = require('algorithmia')
const algoritimoApiKey = require('../credenciais/credentials.json').apiKey
const sentencaboundaydetection = require('sbd')

const watsonApiKey = require('../credenciais/credencialswatson.json').apikey
const NaturalLanguage = require('watson-developer-cloud/natural-language-understanding/v1')

const state = require('./state.js')

const nlu = new NaturalLanguage({
	iam_apikey: watsonApiKey,
	version: '2018-04-05',
	url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})


// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Michael+Jackson
// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Michael+Jackson


// console.log(`Recebi com sucesso o contexto ${contexto.searchTerm}`);
async function robot(contexto) {
	console.log('> [text-robot] Starting...')
  const content = state.load()
	
	await pegaContentFromWikipedia(contexto)
	sanitizeContent(contexto)
	quebraContentEmSentences(contexto)
	limitMaximumSentences(contexto)
	await fetchKeywordsOfAllSentences(contexto)

	state.save(content)

	// var input = {
	// 	"articleName": "AI Winter",
	// 	"lang": "en"
	// };

	async function pegaContentFromWikipedia(content) {
		const algoAutenticacao = algoritimia(algoritimoApiKey)
		const wikepediaAlgo = algoAutenticacao.algo('web/WikipediaParser/0.1.2')
		const wikepediaResponde = await wikepediaAlgo.pipe({ "articleName": content.searchTerm, "lang": content.lang })
		const wikepediaContent = wikepediaResponde.get()

		contexto.sourceContentOriginal = wikepediaContent.content
	}

	function sanitizeContent(contexto) {
		const semLinhaBrancaEMarkDown = removerLinhaBrancaEMarkDown(contexto.sourceContentOriginal)
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

	function removeDataComParenteses(texto) {
		return texto.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
	}

	function quebraContentEmSentences(contexto) {
		contexto.sentences = []

		const sentenca = sentencaboundaydetection.sentences(contexto.sourceContentSanitized)
		sentenca.forEach((sentence) => {
			contexto.sentences.push({
				text: sentence,
				keyworkds: [],
				images: []
			})
		})
	}

}

function limitMaximumSentences(contexto){
	contexto.sentences = contexto.sentences.slice(0, contexto.maximumSentences)
}

async function fetchKeywordsOfAllSentences(contexto){
	console.log('> [text-robot] Starting to fetch keywords from Watson')

	for (const sentence of contexto.sentences) {
		console.log(`> [text-robot] Sentence: "${sentence.text}"`)

		sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)

		console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`)
	}
}

async function fetchWatsonAndReturnKeywords(sentence) {
	return new Promise((resolve, reject) => {
		nlu.analyze({
			text: sentence,
			features: {
				keywords: {}
			}
		}, (erro, response) => {
			if (erro) {
				throw erro
			}

			const keywords = response.keywords.map((keywork) => {
				return keywork.text
			}
			)
			resolve(keywords)

		})
	})
}

module.exports = robot


// var nlu = new NaturalLanguage({
// 	iam_apikey: watsonApiKey,
// 	version: '2018-04-05',
// 	url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
// })

// nlu.analyze({
// 	text: `Hi iam michael jackson an i like doing the moowalker`,
// 	features: {
// 		keywords: {}
// 	}
// }, (erro, response) => {
// 	if (erro) {
// 		throw erro
// 	}
// 	console.log(JSON.stringify(response, null, 4))
// 	//essa codigo abaixo e para finalizar o codigo por aqui.
// 	process.exit(0)
// })

