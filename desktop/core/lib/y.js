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

    if (!a && !b) {
      this.output('1')
    } else if ((a && !b) || (b && !a)) {
      this.output('0')
    } else if ((a && !b) || (b && !a)) {
      this.output('0')
    } else if (orca.lib.num[a] === orca.lib.num[b]) {
      this.output('1')
    } else {
      this.output('0')
    }
  }
}

module.exports = FnY
