const robots = {
  // userInput: require('./robots/user-input.js'),
  comandos: require('./robots/input.js'),
  texto: require('./robots/text.js'),
  state: require('./robots/state.js').load,
  image: require('./robots/image.js')
};

async function start() {

  // robots.comandos()
  // await robots.texto()
  await robots.image()
  // await robots.video()
  // await robots.youtube()

  // const content = robots.state.load()
  // console.dir(content, {depth: null})

}

start()