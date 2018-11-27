'use strict'

const Operator = require('../operator')
// TODO
function OperatorV (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'v', passive)

  this.name = 'beam'
  this.info = 'Bangs the nearest southward operator on bang.'

  this.ports.output = { x: 0, y: 1, unlock: true }

  this.haste = function () {
    while (orca.inBounds(this.x + this.ports.output.x, this.y + this.ports.output.y)) {
      this.ports.output.y += 1
      if (this.listen(this.ports.output) !== '.' && this.listen(this.ports.output) !== '*') { break }
    }
    this.ports.output.y -= 1
  }

  this.run = function () {
    if (!this.bang()) { return }

    this.draw = false

    this.output(`*`)
  }
}

module.exports = OperatorV
