const Orca = require('./desktop/core/orca')
const Terminal = require('./cli/terminal')

const orca = new Orca(40, 20)
const terminal = new Terminal(orca)

const file = process.argv[2]

terminal.install()
terminal.start(file)