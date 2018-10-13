'use strict'

const FnBase = require('./_base')

function FnY (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'automata'
  this.glyph = 'y'
  this.info = 'Compares the type(num/alpha) of westward and eastward _fns_, and return `1` or `0` southward.'
  this.ports = [{ x: -1, y: 0, input: true }, { x: 1, y: 0, input: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() && !this.right()) {
      pico.add(this.x, this.y + 1, '1')
    } else if ((this.left() && !this.right()) || (this.right() && !this.left())) {
      pico.add(this.x, this.y + 1, '0')
    } else if ((this.left() && !this.right()) || (this.right() && !this.left())) {
      pico.add(this.x, this.y + 1, '0')
    } else if (is_num(this.left().glyph) == is_num(this.right().glyph)) {
      pico.add(this.x, this.y + 1, '1')
    } else {
      pico.add(this.x, this.y + 1, '0')
    }
  }

  function is_num (c) {
    return pico.lib.num[c]
  }
}

module.exports = FnY
