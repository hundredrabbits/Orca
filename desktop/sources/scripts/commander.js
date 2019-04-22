'use strict'

function Commander (terminal) {
  const Patterns = require('./patterns')
  this.patterns = new Patterns(terminal)

  this.isActive = false
  this.query = ''

  this.start = function (q = '') {
    this.isActive = true
    this.query = q
    terminal.update()
  }

  this.stop = function () {
    this.isActive = false
    this.query = ''
    terminal.update()
  }

  this.erase = function () {
    this.query = this.query.slice(0, -1)
    this.preview()
  }

  this.write = function (key) {
    if (key.length !== 1) { return }
    this.query += key
    this.preview()
  }

  this.run = function () {
    const tool = this.isActive === true ? 'commander' : 'cursor'
    terminal[tool].trigger()
    terminal.update()
  }

  this.operations = {
    'apm': (val) => { terminal.clock.set(null, parseInt(val)) },
    'bpm': (val) => { terminal.clock.set(parseInt(val), parseInt(val), true) },
    'color': (val) => {
      const parts = val.split(';')
      if (isColor(parts[0])) { terminal.theme.active.b_med = '#' + parts[0] }
      if (isColor(parts[1])) { terminal.theme.active.b_inv = '#' + parts[1] }
      if (isColor(parts[2])) { terminal.theme.active.b_high = '#' + parts[2] }
    },
    'goto': (val) => { terminal.cursor.goto(val) },
    'move': (val) => {
      const pos = val.split(';')
      const x = parseInt(pos[0])
      const y = parseInt(pos[1])
      if (!isNaN(x) && !isNaN(y)) {
        terminal.cursor.moveTo(x, y)
      }
    },
    'play': (val) => { terminal.clock.play() },
    'run': (val) => { terminal.run() },
    'stop': (val) => { terminal.clock.stop() },
    'time': (val) => { terminal.clock.setFrame(parseInt(val)) },
    'write': (val) => {
      const g = val.substr(0, 1)
      const pos = val.substr(1).split(';')
      const x = pos[0] ? parseInt(pos[0]) : terminal.cursor.x
      const y = pos[1] ? parseInt(pos[1]) : terminal.cursor.y
      if (!isNaN(x) && !isNaN(y) && g) {
        terminal.orca.write(x, y, g)
      }
    }
  }

  // Make shorthands
  for (const id in this.operations) {
    this.operations[id.substr(0, 1)] = this.operations[id]
  }

  this.trigger = function (msg = this.query) {
    const cmd = `${msg}`.split(':')[0].toLowerCase()
    const val = `${msg}`.substr(cmd.length + 1)

    if (this.operations[cmd]) {
      this.operations[cmd](val)
    } else if (this.patterns.find(msg)) {
      this.inject(this.patterns.find(msg))
    } else {
      console.warn(`Unknown message: ${msg}`)
    }

    this.stop()
  }

  // Injections

  this.inject = function (pattern) {
    if (!pattern) { return }
    terminal.cursor.writeBlock(pattern.trim().split('\n'))
    terminal.cursor.reset()
  }

  this.preview = function () {
    const pattern = this.patterns.find(this.query)
    if (!pattern) { terminal.cursor.reset(); return }
    const result = pattern.trim().split('\n')
    terminal.cursor.resize(result[0].length, result.length)
  }

  this.onKeyDown = function (event) {
    // Reset
    if ((event.metaKey || event.ctrlKey) && event.key === 'Backspace') {
      terminal.reset()
      event.preventDefault()
      return
    }

    if (event.keyCode === 191 && (event.metaKey || event.ctrlKey)) { terminal.cursor.comment(); event.preventDefault(); return }

    // Copy/Paste
    if (event.keyCode === 67 && (event.metaKey || event.ctrlKey)) { terminal.cursor.copy(); event.preventDefault(); return }
    if (event.keyCode === 88 && (event.metaKey || event.ctrlKey)) { terminal.cursor.cut(); event.preventDefault(); return }
    if (event.keyCode === 86 && (event.metaKey || event.ctrlKey)) { terminal.cursor.paste(); event.preventDefault(); return }
    if (event.keyCode === 65 && (event.metaKey || event.ctrlKey)) { terminal.cursor.selectAll(); event.preventDefault(); return }

    // Undo/Redo
    if (event.keyCode === 90 && (event.metaKey || event.ctrlKey) && event.shiftKey) { terminal.history.redo(); event.preventDefault(); return }
    if (event.keyCode === 90 && (event.metaKey || event.ctrlKey)) { terminal.history.undo(); event.preventDefault(); return }

    if (event.keyCode === 38) { this.onArrowUp(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
    if (event.keyCode === 40) { this.onArrowDown(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
    if (event.keyCode === 37) { this.onArrowLeft(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
    if (event.keyCode === 39) { this.onArrowRight(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }

    if (event.keyCode === 9) { terminal.toggleHardmode(); event.preventDefault(); return }

    if (event.metaKey) { return }
    if (event.ctrlKey) { return }

    if (event.key === ' ' && terminal.cursor.mode === 0) { terminal.clock.togglePlay(); event.preventDefault(); return }
    if (event.key === 'Escape') { terminal.commander.stop(); terminal.clear(); terminal.isPaused = false; terminal.cursor.reset(); return }
    if (event.key === 'Backspace') { terminal[this.isActive === true ? 'commander' : 'cursor'].erase(); event.preventDefault(); return }

    if (event.key === ']') { terminal.modGrid(1, 0); event.preventDefault(); return }
    if (event.key === '[') { terminal.modGrid(-1, 0); event.preventDefault(); return }
    if (event.key === '}') { terminal.modGrid(0, 1); event.preventDefault(); return }
    if (event.key === '{') { terminal.modGrid(0, -1); event.preventDefault(); return }
    if (event.key === '>') { terminal.clock.mod(1); event.preventDefault(); return }
    if (event.key === '<') { terminal.clock.mod(-1); event.preventDefault(); return }

    // Route key to Operator or Cursor
    terminal[this.isActive === true ? 'commander' : 'cursor'].write(event.key)
  }

  this.onKeyUp = function (event) {
    terminal.update()
  }

  this.onArrowUp = function (mod = false, skip = false, drag = false) {
    const leap = skip ? terminal.grid.h : 1
    if (drag) {
      terminal.cursor.drag(0, leap)
    } else if (mod) {
      terminal.cursor.scale(0, leap)
    } else {
      terminal.cursor.move(0, leap)
    }
  }

  this.onArrowDown = function (mod = false, skip = false, drag = false) {
    const leap = skip ? terminal.grid.h : 1
    if (drag) {
      terminal.cursor.drag(0, -leap)
    } else if (mod) {
      terminal.cursor.scale(0, -leap)
    } else {
      terminal.cursor.move(0, -leap)
    }
  }

  this.onArrowLeft = function (mod = false, skip = false, drag = false) {
    const leap = skip ? terminal.grid.w : 1
    if (drag) {
      terminal.cursor.drag(-leap, 0)
    } else if (mod) {
      terminal.cursor.scale(-leap, 0)
    } else {
      terminal.cursor.move(-leap, 0)
    }
  }

  this.onArrowRight = function (mod = false, skip = false, drag = false) {
    const leap = skip ? terminal.grid.w : 1
    if (drag) {
      terminal.cursor.drag(leap, 0)
    } else if (mod) {
      terminal.cursor.scale(leap, 0)
    } else {
      terminal.cursor.move(leap, 0)
    }
  }

  // Events

  document.onkeydown = (event) => { this.onKeyDown(event) }
  document.onkeyup = (event) => { this.onKeyUp(event) }

  // UI

  this.toString = function () {
    return `${this.query}`
  }

  function isColor (str) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#' + str)
  }
}

module.exports = Commander
