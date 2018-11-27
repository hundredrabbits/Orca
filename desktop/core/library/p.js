'use strict'

const Operator = require('../operator')

function OperatorP (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'p', passive)

  this.name = 'push'
  this.info = 'Moves away on bang.'

  this.run = function () {
    const bang = this.bang()
    if (!bang) { return }
    this.move(-bang.x, -bang.y)
  }
}

module.exports = OperatorP
