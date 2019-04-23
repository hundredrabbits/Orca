'use strict'

const Operator = require('../operator')

function OperatorI (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'i', passive)

  this.name = 'index'
  this.info = 'Outputs the index of the first instance of a character.'

  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.haste.key = { x: -2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const len = this.listen(this.ports.haste.len, true, 1, 36)
    for (let x = 1; x <= len; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    const len = this.listen(this.ports.haste.len, true, 1, 36)
    const key = this.listen(this.ports.haste.key)
    const a = []
    for (let x = 1; x <= len; x++) {
      a.push(orca.glyphAt(this.x + x, this.y))
    }
    const index = a.join('').indexOf(key)
    const res = key !== '.' && index > -1 ? orca.keyOf(index) : '.'
    this.output(`${res}`)
  }
}

module.exports = OperatorI
