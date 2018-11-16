'use strict'

const FnBase = require('./_base')

function FnY (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'y', passive)

  this.name = 'type'
  this.info = 'Compares the type(num/alpha/special) of westward and eastward fns, and return 1 or 0 southward.'

  this.ports.inputs.a = { x: 1, y: 0 }
  this.ports.inputs.b = { x: 2, y: 0 }

  this.operation = function () {
    const a = this.listen(this.ports.inputs.a)
    const b = this.listen(this.ports.inputs.b)

    if (!a && !this.east()) {
      this.output('1')
    } else if ((a && !b) || (b && !a)) {
      this.output('0')
    } else if ((a && !b) || (b && !a)) {
      this.output('0')
    } else if (isNum(a) === isNum(b)) {
      this.output('1')
    } else {
      this.output('0')
    }
  }

  function isNum (c) {
    return pico.lib.num[c]
  }
}

module.exports = FnY
