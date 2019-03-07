'use strict'

const Operator = require('../operator')

function OperatorQ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'q', passive)

  this.name = 'query'
  this.info = 'Reads distant operators with offset.'

  this.ports.haste.x = { x: -3, y: 0 }
  this.ports.haste.y = { x: -2, y: 0 }
  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const len = this.listen(this.ports.haste.len, true, 1)
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true)

    for (let i = 1; i <= len; i++) {
      this.ports.input.val = { x: x + i, y: y, unlock: true }
      const res = this.listen(this.ports.input.val)
      this.output(`${res}`, true)
    }
  }
}

module.exports = OperatorQ
