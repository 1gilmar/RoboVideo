const watsonApiKey = require('./credenciais/credencialswatson.json').apikey
const NaturalLanguage = require('watson-developer-cloud/natural-language-understanding/v1')

const nlu = new NaturalLanguage({
	iam_apikey: watsonApiKey,
	version: '2018-04-05',
	url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

function start() {
	nlu.analyze({
		text: `Hi iam michael jackson an i like doing the moowalker`,
		features: {
			keywords: {}
		}
	}, (erro, response) => {
		if (erro) {
			throw erro
		}
		console.log(JSON.stringify(response, null, 4))

	})
}

start()

// essa codigo abaixo e para finalizar o codigo por aqui.
// process.exit(0)
