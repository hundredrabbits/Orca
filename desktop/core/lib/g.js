'use strict'

const FnBase = require('./_base')

function FnG (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Generates a direction fn from bang.'

  this.operation = function () {
    const bang = this.bang()
    const origin = bang || { x: this.x, y: this.y - 1 }

    if (this.south()) { return }
    if (!bang && pico.f % 2 !== 0) { return }

    const vector = { x: this.x - origin.x, y: this.y - origin.y }
    pico.add(this.x + vector.x, this.y + vector.y, vector.x === 1 ? 'E' : vector.x === -1 ? 'W' : vector.y === -1 ? 'N' : 'S')
  }
}

module.exports = FnG
