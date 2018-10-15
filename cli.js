const Pico = require('./desktop/core/pico')
const Terminal = require('./cli/terminal')

const pico = new Pico(40, 20)
const terminal = new Terminal(pico)

const file = process.argv[2]

terminal.install()
terminal.start(file)