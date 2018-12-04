'use strict'

const Operator = require('../operator')

function OperatorKeys (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '!', true)

  this.name = 'keys'
  this.info = 'Bangs on keyboard input.'

  this.ports.haste.key = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const key = this.listen(this.ports.haste.key)

    if (key === '.') { return }

    const index = orca.terminal.io.stack.keys.indexOf(key)

    if (index > -1) {
      this.draw = false
      orca.terminal.io.stack.keys.splice(index, 1)
      this.output('*')
    } else {
      this.output('.')
    }
  }
}

module.exports = OperatorKeys
