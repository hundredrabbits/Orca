'use strict'

export default function Monome (terminal) {
  const serialosc = require('serialosc')
  const template = { size: { w: 10, h: 4 }, offset: { x: 3, y: 2 } }

  this.held = {}
  this.selection = { x: -1, y: -1 }

  this.device = null
  this.mode = 0
  this.size = { w: 16, h: 8 }

  this.start = function () {
    serialosc.start()
    serialosc.on('device:add', (device) => { this.add(device) })
  }

  this.add = function (device) {
    console.log('Monome', 'Model: ' + device.model)
    this.device = device
    this.device.on('key', (data) => { this.onKey(data) })
    this.device.all(0)
  }

  // Interface

  this.onKey = function (data) {
    if (data.s === 1) {
      this.onKeyDown(data)
    } else {
      this.onKeyUp(data)
    }
    this.update()
  }

  this.onKeyDown = function (data) {
    this.hold(data.x, data.y)

    if (this.mode === 0 && this.isSelected(data.x, data.y)) {
      this.showKeyboard()
    } else if (this.mode === 1) {
      this.onKeyboard(data.x - template.offset.x, data.y - template.offset.y)
    } else {
      this.select(data.x, data.y)
    }
  }

  this.onKeyUp = function (data) {
    this.release(data.x, data.y)
    // this.setMode(0)
  }

  this.hold = function (x, y) {
    this.held[idAtPos(x, y, template.size.w, template.size.h)] = true
  }

  this.release = function (x, y) {
    this.held[idAtPos(x, y, template.size.w, template.size.h)] = false
  }

  this.select = function (x, y) {
    this.selection.x = x
    this.selection.y = y
    terminal.cursor.moveTo(this.selection.x, this.selection.y)
  }

  this.isSelected = function (x, y) {
    return this.selection.x === x && this.selection.y === y
  }

  // Draw

  this.update = function () {
    if (this.mode == 1) {
      this.viewKeyboard()
    } else {
      this.viewGrid()
    }
  }

  this.viewKey = function (x, y) {
    if (x >= template.offset.x && x < template.offset.x + template.size.w && y >= template.offset.y && y < template.offset.y + template.size.h) {
      return 15
    }
    return 0
  }

  this.viewKeyboard = function () {
    const m = makeEmpty(this.size.x, this.size.y)
    for (let x = 0; x < this.size.w; x++) {
      for (let y = 0; y < this.size.h; y++) {
        m[x][y] = this.viewKey(x, y)
      }
    }
    this.redraw(m)
  }

  this.viewGrid = function () {
    const m = makeEmpty(this.size.x, this.size.y)
    for (let x = 0; x < this.size.w; x++) {
      for (let y = 0; y < this.size.h; y++) {
        const g = terminal.makeGlyph(x, y)
        const type = terminal.makeStyle(x, y, g)
        // Interest
        if (type === 1 || type === 2 || type === 3 || type === 5) {
          m[x][y] = 2
        }
        // Input
        if (type === 2) {
          m[x][y] = 5
        }
        // Selection
        if (type === 4) {
          m[x][y] = 5
        }
        // Any content
        if (g !== '.' && g !== '+') {
          m[x][y] = 15
        }
      }
    }

    this.redraw(m)
  }

  this.redraw = function (m) {
    if (!this.device) { return }

    const left = []
    const right = []
    for (let y = 0; y < this.size.h; y++) {
      left[y] = []
      for (let x = 0; x < 8; x++) {
        left[y].push(m[x][y])
      }
    }
    for (let y = 0; y < this.size.h; y++) {
      right[y] = []
      for (let x = 8; x < 16; x++) {
        right[y].push(m[x][y])
      }
    }
    this.device.levelMap(0, 0, left)
    this.device.levelMap(8, 0, right)
  }

  // Keyboard

  const keyboard = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ]

  this.showKeyboard = function () {
    console.log('Show Keyboard')
    this.mode = 1
  }

  this.hideKeyboard = function () {
    console.log('Hide Keyboard')
    this.mode = 0
  }

  this.onKeyboard = function (x, y) {
    if (!keyboard[y] || !keyboard[y][x]) { console.warn('Monome', `Unknown position at ${x},${y}`); this.hideKeyboard(); return }
    const g = keyboard[y][x]
    if (!g) { console.warn('Monome', `Unknown glyph at ${x},${y}`); this.hideKeyboard(); return }
    terminal.orca.write(this.selection.x, this.selection.y, g.toUpperCase())
    this.hideKeyboard()
  }

  // Modes

  this.isInsertMode = function () {
    return this.mode === 1
  }

  this.setMode = function (mode) {
    this.mode = mode
    this.update()
  }

  this.toggleMode = function () {
    this.setMode(this.mode === 1 ? 0 : 1)
  }

  function makeEmpty (w = 16, h = 8) {
    const m = []
    for (let x = 0; x < w; x++) {
      m.push([])
      for (let y = 0; y < h; y++) {
        m[x].push(0)
      }
    }
    return m
  }

  function idAtPos (x, y, w, h) {
    return x + (y * w)
  }
}
