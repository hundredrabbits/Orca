'use strict'

const Operator = require('../operator')

function OperatorQ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'q', passive)

  this.name = 'query'
  this.info = 'Reads distant operators with offset.'

  this.ports.haste.x = { x: -3, y: 0 }
  this.ports.haste.y = { x: -2, y: 0 }
  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    const len = this.listen(this.ports.haste.len, true, 1)
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true)
    for (let i = 1; i <= len; i++) {
      orca.lock(this.x + x + i, this.y + y)
    }
  }

  this.run = function () {
    const len = this.listen(this.ports.haste.len, true, 1)
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true)
    for (let i = 1; i <= len; i++) {
      this.ports.input[`val${i}`] = { x: x + i, y: y }
      orca.lock(this.x + x + i, this.y + y)
      this.ports.output = { x: i - len, y: 1, unlock: true }
      const res = this.listen(this.ports.input[`val${i}`])
      this.output(`${res}`, true)
    }
    this.ports.output = { x: 0, y: 1, unlock: true }
  }
}

module.exports = OperatorQ
