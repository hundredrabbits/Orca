'use strict'

const Operator = require('../operator')

function OperatorL (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'l', passive)

  this.name = 'loop'
  this.info = 'Loops a number of eastward operators.'

  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.haste.rate = { x: -2, y: 0 }

  this.haste = function () {
    const len = this.listen(this.ports.haste.len, true)
    for (let x = 1; x <= len; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    const len = this.listen(this.ports.haste.len, true)
    const rate = this.listen(this.ports.haste.rate, true)
    const a = []
    for (let x = 1; x <= len; x++) {
      a.push(orca.glyphAt(this.x + x, this.y))
    }
    for (let x = 1; x <= rate; x++) {
      a.push(a.shift())
    }
    for (const id in a) {
      const x = parseInt(id) + 1
      orca.write(this.x + x, this.y, a[id])
    }
  }
}

module.exports = OperatorL
