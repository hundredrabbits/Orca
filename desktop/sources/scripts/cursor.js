'use strict'

const { clipboard } = require('electron')

function Cursor (terminal) {
  this.x = 0
  this.y = 0
  this.w = 1
  this.h = 1
  this.mode = 0
  this.block = []

  this.move = function (x, y) {
    this.x = clamp(this.x + x, 0, terminal.orca.w - 1)
    this.y = clamp(this.y - y, 0, terminal.orca.h - 1)
    terminal.update()
  }

  this.scale = function (x, y) {
    this.w = clamp(this.w + x, 1, terminal.orca.w - this.x)
    this.h = clamp(this.h - y, 1, terminal.orca.h - this.y)
    terminal.update()
  }

  this.drag = function (x, y) {
    this.cut()
    this.move(x, y)
    this.paste()
  }

  this.reset = function (pos = false) {
    if (pos) {
      this.x = 0
      this.y = 0
    }
    this.move(0, 0)
    this.w = 1
    this.h = 1
    this.mode = 0
  }

  this.selectAll = function () {
    this.x = 0
    this.y = 0
    this.w = terminal.orca.w
    this.h = terminal.orca.h
    this.mode = 0
    terminal.update()
  }

  this.copy = function () {
    const block = this.getBlock()
    var rows = []
    for (var i = 0; i < block.length; i++) {
      rows.push(block[i].join(''))
    }
    const result = rows.join('\n')
    clipboard.writeText(result)
  }

  this.cut = function () {
    this.copy()
    this.erase()
  }

  this.paste = function () {
    this.writeBlock(this.toRect(), clipboard.readText().split(/\r?\n/))
  }

  this.read = function () {
    return terminal.orca.glyphAt(this.x, this.y)
  }

  this.write = function (g) {
    if (this.mode === 2) {
      terminal.io.sendKey(event.key)
      return
    }
    terminal.orca.write(this.x, this.y, g)
    if (this.mode === 1) {
      this.move(1, 0)
    }
    terminal.history.record(terminal.orca.s)
  }

  this.erase = function () {
    if (this.w === 1 && this.h === 1 && terminal.orca.glyphAt(this.x, this.y) === '.') { this.move(-1, 0); return } // Backspace Effect
    this.eraseBlock(this.x, this.y, this.w, this.h)
    terminal.history.record(terminal.orca.s)
  }

  this.goto = function (str) {
    const i = terminal.orca.s.indexOf(str)
    if (i < 0) { return }
    const pos = terminal.orca.posAt(i)
    this.x = pos.x + 1
    this.y = pos.y
  }

  this.trigger = function () {
    const operator = terminal.orca.operatorAt(this.x, this.y)
    if (operator) {
      operator.run(true)
    }
  }

  this.toggleMode = function (val) {
    this.mode = this.mode === 0 ? val : 0
  }

  this.inspect = function (name = true, ports = false) {
    if (this.w > 1 || this.h > 1) { return 'multi' }
    const port = terminal.portAt(this.x, this.y)
    if (port) { return `${port[3]}` }
    if (terminal.orca.lockAt(this.x, this.y)) { return 'locked' }
    return 'empty'
  }

  // Block

  this.getBlock = function (rect = this.toRect()) {
    const block = []
    for (let _y = rect.y; _y < rect.y + rect.h; _y++) {
      const line = []
      for (let _x = rect.x; _x < rect.x + rect.w; _x++) {
        line.push(terminal.orca.glyphAt(_x, _y))
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
        terminal.orca.write(_x, _y, block[lineId][glyphId])
        _x++
      }
      _y++
    }
    terminal.history.record(terminal.orca.s)
  }

  this.eraseBlock = function (x, y, w, h) {
    for (let _y = y; _y < y + h; _y++) {
      for (let _x = x; _x < x + w; _x++) {
        terminal.orca.write(_x, _y, '.')
      }
    }
    terminal.history.record(terminal.orca.s)
  }

  this.toRect = function () {
    return { x: this.x, y: this.y, w: this.w, h: this.h }
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Cursor
