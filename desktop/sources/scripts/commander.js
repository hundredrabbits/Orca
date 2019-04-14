'use strict'

function Commander (terminal) {
  this.patterns = require('./patterns')

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
    'goto': (val) => { terminal.cursor.goto(val) },
    'play': (val) => { terminal.clock.play() },
    'run': (val) => { terminal.run() },
    'stop': (val) => { terminal.clock.stop() },
    'time': (val) => { terminal.clock.setFrame(parseInt(val)) },
    'write': (val) => {
      const g = val.substr(0, 1)
      const pos = val.substr(1).split(';')
      const x = parseInt(pos[0])
      const y = parseInt(pos[1])
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
    } else if (this.patterns[msg]) {
      this.inject(this.patterns[msg])
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
    if (!this.patterns[this.query]) { terminal.cursor.reset(); return }
    const result = this.patterns[this.query].trim().split('\n')
    terminal.cursor.resize(result[0].length, result.length)
  }

  this.onKeyDown = function (event) {
    // Reset
    if ((event.metaKey || event.ctrlKey) && event.key === 'Backspace') {
      terminal.reset()
      event.preventDefault()
      return
    }
    if (event.key === 'c' && (event.metaKey || event.ctrlKey)) { terminal.cursor.copy(); event.preventDefault(); return }
    if (event.key === 'x' && (event.metaKey || event.ctrlKey)) { terminal.cursor.cut(); event.preventDefault(); return }
    if (event.key === 'v' && (event.metaKey || event.ctrlKey)) { terminal.cursor.paste(); event.preventDefault(); return }
    if (event.key === 'a' && (event.metaKey || event.ctrlKey)) { terminal.cursor.selectAll(); event.preventDefault(); return }

    // Undo/Redo
    if (event.key === 'z' && (event.metaKey || event.ctrlKey) && event.shiftKey) { terminal.history.redo(); event.preventDefault(); return }
    if (event.key === 'z' && (event.metaKey || event.ctrlKey)) { terminal.history.undo(); event.preventDefault(); return }

    if (event.keyCode === 38) { this.onArrowUp(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
    if (event.keyCode === 40) { this.onArrowDown(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
    if (event.keyCode === 37) { this.onArrowLeft(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
    if (event.keyCode === 39) { this.onArrowRight(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }

    if (event.metaKey) { return }
    if (event.ctrlKey) { return }

    if (event.key === ' ' && terminal.cursor.mode === 0) { terminal.clock.togglePlay(); event.preventDefault(); return }
    if (event.key === 'Escape') { terminal.commander.stop(); terminal.clear(); terminal.isPaused = false; terminal.cursor.reset(); return }

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
}

module.exports = Commander
