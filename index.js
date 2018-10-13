const Program = require('./core/program')
const Terminal = require('./cli/terminal')

const program = new Program(39, 29)
const terminal = new Terminal(program)

terminal.install();
terminal.start();
