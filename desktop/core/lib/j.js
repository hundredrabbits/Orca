'use strict'

const FnBase = require('./_base')

function FnJ (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  // TODO
  this.name = 'jump'
  this.glyph = 'j'
  this.info = 'Copies the northward fn, southwardly.'

  this.ports = [{ x: 0, y: -1, input: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    const n = this.north()
    if (!n) { return }

    pico.add(this.x, this.y + 1, n.glyph)
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnJ
