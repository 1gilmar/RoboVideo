const imageDownloader = require('image-downloader')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state.js')

const googleSearchCredentials = require('../credenciais/google-search.json')

async function robot() {
	console.log('> [image-robot] Iniciado...')
	const content = state.load()

	//gera as sentencas de images
	await fetchImagesOfAllSentences(content)
	await downloadAllImages(content)

	//sava os ajuste no json
	state.save(content)

	async function fetchImagesOfAllSentences(content) {
		for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
			let query

			if (sentenceIndex === 0) {
				query = `${content.searchTerm}`
			} else {
				query = `${content.searchTerm} ${content.sentences[sentenceIndex].keywords[0]}`
			}

			console.log(`> [image-robot] Consulta Google images com: "${query}"`)

			content.sentences[sentenceIndex].images = await fetchGoogleAndReturnImagesLinks(query)
			content.sentences[sentenceIndex].googleSearchQuery = query
		}
	}

	// parametros de pesquista
	// https://developers.google.com/apis-explorer/#p/customsearch/v1/search.cse.list
	async function fetchGoogleAndReturnImagesLinks(query) {
		const response = await customSearch.cse.list({
			auth: googleSearchCredentials.apiKey,
			cx: googleSearchCredentials.searchEngineId,
			q: query,
			searchType: 'image',
			// imgSize: 'huge',
			num: 2
		})

		// descomentar 2 linha abaixo para testar
		// console.dir(response.data.items, { depth: null })
		// process.exit(0)

		// criando um array
		const imagesUrl = response.data.items.map((item) => {
			return item.link
		})
		return imagesUrl
	}

	async function downloadAllImages(content) {
		content.downloadedImages = []

		for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
			const images = content.sentences[sentenceIndex].images

			for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
				const imageUrl = images[imageIndex]

				try {
					if (content.downloadedImages.includes(imageUrl)) {
						throw new Error('Esta imagem já foi baixada')
					}

					await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
					content.downloadedImages.push(imageUrl)
					console.log(`> [image-robot] [${sentenceIndex}][${imageIndex}] Imagem baixada com sucesso: ${imageUrl}`)
					break
				} catch (error) {
					console.log(`> [image-robot] [${sentenceIndex}][${imageIndex}] Error (${imageUrl}): ${error}`)
				}
			}
		}
	}

	async function downloadAndSave(url, fileImg) {
		return imageDownloader.image({
			url: url,
			dest: `./images/${fileImg}`
		})
	}
}

module.exports = robot