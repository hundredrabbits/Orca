'use strict'

function Cursor (pico, terminal) {
  this.x = 0
  this.y = 0
  this.w = 1
  this.h = 1

  this.block = []

  this.mode = 0

  this.move = function (x, y) {
    this.x = clamp(this.x + x, 0, pico.w - 1)
    this.y = clamp(this.y - y, 0, pico.h - 1)
    terminal.update()
  }

  this.scale = function (x, y) {
    this.w = clamp(this.w + x, 1, 30)
    this.h = clamp(this.h - y, 1, 30)
    terminal.update()
  }

  this.reset = function () {
    this.w = 1
    this.h = 1
    this.mode = 0
  }

  this.copy = function () {
    terminal.log(`Copy ${this._position()}`)
    this.block = pico.getBlock(this.x, this.y, this.w, this.h)
  }

  this.paste = function () {
    terminal.log(`Paste ${this._position()}`)
    pico.addBlock(this.x, this.y, this.block)
  }

  this.cut = function () {
    terminal.log(`Cut ${this._position()}`)
    this.copy()
    this.erase()
  }

  this.insert = function (g) {
    pico.add(this.x, this.y, g)
    if (this.mode === 1) {
      this.move(1, 0)
    }
  }

  this.erase = function (g) {
    if (this.w === 1 && this.h === 1 && pico.glyphAt(this.x, this.y) === '.') {
      this.move(-1, 0)
      return
    }
    terminal.log(`Erase ${this._position()}`)
    pico.removeBlock(this.x, this.y, this.w, this.h)
    this.reset()
  }

  this.inspect = function (name = true, ports = false) {
    if (this.w > 1 || this.h > 1) { return 'multi' }
    // Ports
    const port = pico.portAt(this.x, this.y)
    if (port) { return `${port.name}` }
    // Lock
    if (pico.lockAt(this.x, this.y)) { return 'locked' }
    return 'empty'
  }

  this.selectAll = function () {
    this.x = 0
    this.y = 0
    this.w = pico.w
    this.h = pico.h
  }

  this._position = function () {
    return `${this.x},${this.y}` + (this.w !== 1 || this.h !== 1 ? `[${this.w}x${this.h}]` : '')
  }

  this._mode = function () {
    return this.mode === 1 ? 'inser' : 'write'
  }

  this.toggleMode = function () {
    this.mode = this.mode === 0 ? 1 : 0
    terminal.log(`Changed Mode ${this.mode === 1 ? 'inser' : 'write'}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Cursor
