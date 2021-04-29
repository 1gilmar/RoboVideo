const robots = {
  // userInput: require('./robots/user-input.js'),
  texto: require('./robots/text.js'),
  input: require('./robots/input')
};

async function start() {

  await robots.input()
  // await robots.texto()
 
  console.log()

}

start()