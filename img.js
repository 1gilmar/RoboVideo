const imageDownloader = require('image-downloader')

async function downloadAndSave(url, img) {
    return imageDownloader.image({
        url: url,
        dest: `./images/${img}`
    })
}

downloadAndSave('https://www.musicinminnesota.com/wp-content/uploads/2021/02/Michael-Jackson-live.jpg', 'teste.png')