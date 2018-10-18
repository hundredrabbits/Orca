'use strict'

const FnBase = require('./_base')

function FnL (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.type = 'list'
  this.name = 'loop'
  this.glyph = 'l'
  this.info = 'Loop a number of characters ahead.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: -1, y: 0, input: true }]

  if (pico) {
    this.w = this.west()
    this.len = this.w ? pico.allowed.indexOf(this.w.glyph) : 0
    for (let x = 1; x <= this.len; x++) {
      this.ports.push({ x: x, y: 0, output: true })
    }
  }

  this.haste = function () {
    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
  }

  this.operation = function () {
    if (!this.len || this.len < 1 || !this.bang()) { return }

    const a = []
    for (let x = 1; x <= this.len; x++) {
      a.push(pico.glyphAt(this.x + x, this.y))
    }
    a.push(a.shift())

    for (const id in a) {
      const x = parseInt(id) + 1
      pico.add(this.x + x, this.y, a[id])
    }
  }
}

module.exports = FnL
