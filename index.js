const robots = {
  // userInput: require('./robots/user-input.js'),
  texto: require('./robots/text.js'),
  input: require('./robots/input')
};

async function start() {

  robots.input()
  await robots.texto()
  // await robots.image()
  // await robots.video()
  // await robots.youtube()

}

start()