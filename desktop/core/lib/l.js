'use strict'

const Fn = require('../fn')

function FnL (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'l', passive)

  this.name = 'loop'
  this.info = 'Loops a number of eastward fns.'

  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    this.len = this.listen(this.ports.haste.len, true)

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
}

module.exports = FnL
