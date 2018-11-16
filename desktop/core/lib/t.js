'use strict'

const FnBase = require('./_base')

function FnT (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'u', passive)

  this.name = 'track'
  this.info = 'Read character at position.'
  // this.ports.push({ x: -1, y: 0, input: true }, { x: -2, y: 0, input: true }, { x: 0, y: 1, output: true })

  // if (pico) {
  //   this.lenCh = pico.glyphAt(this.x - 1, this.y)
  //   this.len = this.lenCh ? pico.valueOf(this.lenCh) : 0
  //   this.valCh = pico.glyphAt(this.x - 2, this.y)
  //   this.val = this.valCh ? pico.valueOf(this.valCh) : 0

  //   if (this.lenCh === '.' || this.valCh === '.') { return }

  //   if (!this.len || this.len < 1 || this.val < 0) { return }
  //   this.ports.push({ x: (this.val % this.len) + 1, y: 0, output: true })
  // }

  this.haste = function () {
    pico.lock(this.x - 1, this.y)
    pico.lock(this.x, this.y - 1)
    pico.lock(this.x, this.y + 1)
    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
  }

  this.operation = function () {
    if (!this.len || this.len < 1 || this.val < 0) { return }
    const x = (this.x + 1) + (this.val % this.len)
    const index = pico.glyphAt(x, this.y)
    pico.add(this.x, this.y + 1, index)
  }
}

module.exports = FnT
