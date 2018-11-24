'use strict'

const Fn = require('../fn')

function FnM (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'm', passive)

  this.name = 'modulo'
  this.info = 'Outputs the modulo of inputs.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.input.mod = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const val = this.listen(this.ports.input.val, true)
    const mod = this.listen(this.ports.input.mod, true)
    const key = val % (mod !== 0 ? mod : 1)
    const res = orca.keyOf(key)
    this.output(`${res}`)
  }
}

module.exports = FnM
