'use strict'

const FnBase = require('./_base')

function FnB (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'b', isPassive)

  this.name = 'banger'
  this.info = 'Bangs if input is `1`, `N`, `S`, `W` or `E`.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function () {
    const val = this.listen(this.ports.input.val)
    const chr = ['1', 'W', 'S', 'N', 'E', '*']
    const res = chr.indexOf(val.toUpperCase()) > -1 ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = FnB
