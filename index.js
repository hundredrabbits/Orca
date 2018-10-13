const Pico = require('./core/pico')
const Terminal = require('./cli/terminal')

const pico = new Pico(40, 20)
const terminal = new Terminal(pico)

terminal.install()
terminal.start()