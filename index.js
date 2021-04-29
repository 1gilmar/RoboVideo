const robots = {
  // userInput: require('./robots/user-input.js'),
  comandos: require('./robots/input'),
  texto: require('./robots/text.js')
};

async function start() {

  robots.comandos()
  await robots.texto()
  // await robots.image()
  // await robots.video()
  // await robots.youtube()

}

start()