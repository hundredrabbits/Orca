'use strict'

const FnBase = require('./_base')

function FnU (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'u', passive)

  this.type = 'list'
  this.name = 'until'
  this.info = 'Read character at position.'
  this.ports.push({ x: -1, y: 0, input: true }, { x: 0, y: -1, input: true }, { x: 0, y: 1, output: true })

  if (pico) {
    this.lenCh = this.west()
    this.len = this.lenCh ? pico.allowed.indexOf(this.lenCh.glyph) : 0
    this.valCh = this.north()
    this.val = this.valCh ? pico.allowed.indexOf(this.valCh.glyph) : 0
    if (!this.len || this.len < 1 || this.val < 0) { return }
    this.ports.push({ x: (this.val % this.len) + 1, y: 0, output: true })
  }

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
    pico.add(this.x, this.y + 1, pico.glyphAt(this.x + ((this.val) % this.len) + 1, this.y))
  }
}

module.exports = FnU
