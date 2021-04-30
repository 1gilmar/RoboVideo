
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state.js')

const googleSearchCredentials = require('../credenciais/google-search.json')

async function robot() {
    const content = state.load()

    await fetchImagesOfAllSentences(content)

    state.save(content)

    async function fetchImagesOfAllSentences(content) {
        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`
            sentence.images = await fetchGoogleAndReturnImagesLinks(query)

            sentence.googleSearchQuery = query
        }
    }

    // marametros de pesquista
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




}

module.exports = robot