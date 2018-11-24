'use strict'

const Fn = require('../fn')

function FnY (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'y', passive)

  this.name = 'type'
  this.info = 'Compares the type(num/alpha/special) of inputs, and return `1` or `0`.'

  this.ports.input.a = { x: 1, y: 0 }
  this.ports.input.b = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const a = this.listen(this.ports.input.a)
    const b = this.listen(this.ports.input.b)

    this.output(orca.typeOf(a) === orca.typeOf(b) ? '1' : '0')
  }
}

module.exports = FnY
