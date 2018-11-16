'use strict'

function Cursor (terminal) {
  this.terminal = terminal

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
    this.terminal.log(`Copy ${this._position()}`)
    this.block = this.terminal.pico.getBlock(this.x, this.y, this.w, this.h)
  }

  this.paste = function () {
    this.terminal.log(`Paste ${this._position()}`)
    this.terminal.pico.addBlock(this.x, this.y, this.block)
  }

  this.cut = function () {
    this.terminal.log(`Cut ${this._position()}`)
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
    this.terminal.log(`Erase ${this._position()}`)
    this.terminal.pico.removeBlock(this.x, this.y, this.w, this.h)
  }

  this.inspect = function () {
    if (this.w > 1 || this.h > 1) { return 'multi' }

    const g = pico.glyphAt(this.x, this.y)
    return pico.docs[g] ? pico.docs[g] : 'empty'
  }

  this._position = function () {
    return `${this.x},${this.y}` + (this.w !== 1 || this.h !== 1 ? `[${this.w}x${this.h}]` : '')
  }

  this._mode = function () {
    return this.mode === 1 ? 'inser' : 'write'
  }

  this.toggleMode = function () {
    this.mode = this.mode === 0 ? 1 : 0
    this.terminal.log(`Changed Mode ${this.mode === 1 ? 'inser' : 'write'}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Cursor
