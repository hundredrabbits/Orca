'use strict'

const Operator = require('../operator')

function OperatorL (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'l', passive)

  this.name = 'loop'
  this.info = 'Loops a number of eastward operators.'

  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 1, 16)

    for (let x = 1; x <= this.len; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    if (!this.len || this.len < 1) { return }

    const a = []
    for (let x = 1; x <= this.len; x++) {
      a.push(orca.glyphAt(this.x + x, this.y))
    }
    a.push(a.shift())

    for (const id in a) {
      const x = parseInt(id) + 1
      orca.write(this.x + x, this.y, a[id])
    }
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorL
