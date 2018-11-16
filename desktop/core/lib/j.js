'use strict'

const FnBase = require('./_base')

function FnJ (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'j', passive)

  this.name = 'jump'
  this.info = 'Copies the northward fn, southwardly.'
  // this.ports.push({ x: 0, y: -1, input: true })
  // this.ports.push({ x: 0, y: 1, output: true })

  this.haste = function () {
    pico.lock(this.x, this.y + 1)
  }

  this.operation = function () {
    const n = this.north()
    pico.add(this.x, this.y + 1, !n ? '.' : n.glyph)
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnJ
