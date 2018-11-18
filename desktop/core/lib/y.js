'use strict'

const FnBase = require('./_base')

function FnY (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'y', isPassive)

  this.name = 'type'
  this.info = 'Compares the type(num/alpha/special) of westward and eastward fns, and return 1 or 0 southward.'

  this.ports.input.a = { x: 1, y: 0 }
  this.ports.input.b = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function () {
    const a = this.listen(this.ports.input.a)
    const b = this.listen(this.ports.input.b)

    if (!a && !this.east()) {
      this.output('1')
    } else if ((a && !b) || (b && !a)) {
      this.output('0')
    } else if ((a && !b) || (b && !a)) {
      this.output('0')
    } else if (pico.lib.num[a] === pico.lib.num[b]) {
      this.output('1')
    } else {
      this.output('0')
    }
  }
}

module.exports = FnY
