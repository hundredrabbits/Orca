'use strict'

function Cursor (terminal) {
  this.x = 0
  this.y = 0
  this.w = 1
  this.h = 1
  this.mode = 0
  this.block = []

  this.move = function (x, y) {
    this.x = clamp(this.x + x, 0, terminal.room.w - 1)
    this.y = clamp(this.y - y, 0, terminal.room.h - 1)
    terminal.update()
  }

  this.scale = function (x, y) {
    this.w = clamp(this.w + x, 1, terminal.room.w - this.x)
    this.h = clamp(this.h - y, 1, terminal.room.h - this.y)
    terminal.update()
  }

  this.reset = function () {
    this.move(0, 0)
    this.w = 1
    this.h = 1
    this.mode = 0
    terminal.enter()
  }

  this.selectAll = function () {
    this.x = 0
    this.y = 0
    this.w = terminal.room.w
    this.h = terminal.room.h
    this.mode = 0
    terminal.update()
  }

  this.copy = function () {
    this.block = this.getBlock()
  }

  this.cut = function () {
    this.copy()
    this.erase()
  }

  this.paste = function () {
    this.writeBlock(this.toRect(), this.block)
  }

  this.write = function (g) {
    if (this.mode === 2) {
      terminal.io.sendKey(event.key)
      return
    }
    terminal.room.write(this.x, this.y, g)
    if (this.mode === 1) {
      this.move(1, 0)
    }
    terminal.history.record()
  }

  this.erase = function () {
    if (this.w === 1 && this.h === 1 && terminal.room.glyphAt(this.x, this.y) === '.') { this.move(-1, 0); return } // Backspace Effect
    this.eraseBlock(this.x, this.y, this.w, this.h)
    terminal.history.record()
  }

  this.toggleMode = function (val) {
    if (terminal.room.glyphAt(this.x, this.y) === '/') {
      terminal.enter(terminal.room.s.charAt(terminal.room.indexAt(this.x, this.y) - 1))
      return
    }
    this.mode = this.mode === 0 ? val : 0
  }

  this.inspect = function (name = true, ports = false) {
    if (this.w > 1 || this.h > 1) { return 'multi' }
    const port = terminal.portAt(this.x, this.y)
    if (port) { return `${port.name}` }
    if (terminal.room.lockAt(this.x, this.y)) { return 'locked' }
    return 'empty'
  }

  // Block

  this.getBlock = function (rect = this.toRect()) {
    const block = []
    for (let _y = rect.y; _y < rect.y + rect.h; _y++) {
      const line = []
      for (let _x = rect.x; _x < rect.x + rect.w; _x++) {
        line.push(terminal.room.glyphAt(_x, _y))
      }
      block.push(line)
    }
    return block
  }

  this.writeBlock = function (rect, block) {
    if (!block || block.length === 0) { return }
    let _y = rect.y
    for (const lineId in block) {
      let _x = rect.x
      for (const glyphId in block[lineId]) {
        terminal.room.write(_x, _y, block[lineId][glyphId])
        _x++
      }
      _y++
    }
    terminal.history.record()
  }

  this.eraseBlock = function (x, y, w, h) {
    for (let _y = y; _y < y + h; _y++) {
      for (let _x = x; _x < x + w; _x++) {
        terminal.room.write(_x, _y, '.')
      }
    }
    terminal.history.record()
  }

  this.toRect = function () {
    return { x: this.x, y: this.y, w: this.w, h: this.h }
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Cursor
