'use strict'

const FnBase = require('./_base')

function FnQqq (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'qqq'
  this.glyph = '?'
  this.info = 'Play note.'

  this.ports = [{ x: 0, y: -1, input: true }]

  this.haste = function () {
    pico.lock(this.x, this.y - 1)
  }

  this.run = function () {
    const n = this.north()
    if (n) {
      terminal.qqq.play()
    }
  }
}

module.exports = FnQqq
