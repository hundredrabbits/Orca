const Program = require('./core/program')
const Terminal = require('./cli/terminal')

const program = new Program(40, 30)
const terminal = new Terminal(program)

terminal.install();
terminal.start();
