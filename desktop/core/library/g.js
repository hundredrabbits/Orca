'use strict'

const Operator = require('../operator')

function OperatorG (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Writes distant operators with offset.'

  this.ports.haste.x = { x: -3, y: 0 }
  this.ports.haste.y = { x: -2, y: 0 }
  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1, unlock: true }

  this.haste = function () {
    this.ports.input = []
    this.len = this.listen(this.ports.haste.len, true, 1)
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true) + 1
    for (let i = 0; i < this.len; i++) {
      this.ports.input.push({ x: i + 1, y: 0 })
    }
    this.ports.output = { x: x, y: y, unlock: true }
  }

  this.run = function () {
    // Read
    let str = ''
    for (const id in this.ports.input) {
      str += this.listen(this.ports.input[id])
    }
    // Write
    for (let i = 0; i < str.length; i++) {
      orca.write(this.x + this.ports.output.x + i, this.y + this.ports.output.y, str[i])
    }
  }
}

module.exports = OperatorG
