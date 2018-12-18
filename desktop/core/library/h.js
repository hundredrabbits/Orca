'use strict'

const Operator = require('../operator')

function OperatorH (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Stops southward operators from operating.'

  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    this.len = this.listen(this.ports.haste.len, true, 1)
    this.len = this.len > 9 ? 1 : this.len
    for (let x = 0; x < this.len; x++) {
      orca.lock(this.x + x, this.y + 1)
    }
  }
}

module.exports = OperatorH
