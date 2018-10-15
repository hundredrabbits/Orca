'use strict'

const FnBase = require('./_base')

function FnPort (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'null'
  this.glyph = ':'
  this.info = 'Call a function by name, freeze 3 characters eastward.'

  this.ports = [{ x: 1, y: 0, bang: true },{ x: 2, y: 0, bang: true },{ x: 3, y: 0, bang: true }]

  this.haste = function () {
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
  }

  this.run = function () {
    const cmd = `${pico.glyphAt(this.x + 1, this.y)}${pico.glyphAt(this.x + 2, this.y)}${pico.glyphAt(this.x + 3, this.y)}`

    if (cmd.indexOf('.') > -1) { return }

    pico.terminal.log(`command: ${cmd}`)
  }
}

module.exports = FnPort
