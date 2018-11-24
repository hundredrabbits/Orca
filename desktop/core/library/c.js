'use strict'

const Fn = require('../fn')

function FnC (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Outputs a constant value based on the runtime frame.'

  this.ports.input.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const mod = this.listen(this.ports.input.mod, true)
    const key = (orca.f % (mod || 10))
    const res = orca.allowed[key] ? orca.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnC
