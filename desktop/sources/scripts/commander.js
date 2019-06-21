'use strict'

export default function Commander (terminal) {
  this.isActive = false
  this.query = ''
  this.history = []
  this.historyIndex = 0

  // Library

  this.passives = {
    'find': (p) => { terminal.cursor.find(p.str) },
    'select': (p) => { terminal.cursor.select(p.x, p.y, p.w, p.h) },
    'inject': (p) => { terminal.cursor.select(p._x, p._y); terminal.source.inject(p._str, false) },
    'write': (p) => { terminal.cursor.select(p._x, p._y, p._str.length) }
  }

  this.actives = {
    // Ports
    'osc': (p) => { terminal.io.osc.select(p.int) },
    'udp': (p) => { terminal.io.udp.select(p.int) },
    'ip': (p) => { terminal.io.setIp(p.str) },
    'cc': (p) => { terminal.io.cc.setOffset(p.int) },
    // Cursor
    'copy': (p) => { terminal.cursor.copy() },
    'paste': (p) => { terminal.cursor.paste(true) },
    'erase': (p) => { terminal.cursor.erase() },
    // Controls
    'play': (p) => { terminal.clock.play() },
    'stop': (p) => { terminal.clock.stop() },
    'run': (p) => { terminal.run() },
    // Speed
    'apm': (p) => { terminal.clock.set(null, p.int) },
    'bpm': (p) => { terminal.clock.set(p.int, p.int, true) },
    'time': (p) => { terminal.clock.setFrame(p.int) },
    'rewind': (p) => { terminal.clock.setFrame(terminal.orca.f - p.int) },
    'skip': (p) => { terminal.clock.setFrame(terminal.orca.f + p.int) },
    // Effects
    'rot': (p) => { terminal.cursor.rotate(p.int) },
    // Themeing
    'color': (p) => { terminal.theme.set('b_med', p.parts[0]); terminal.theme.set('b_inv', p.parts[1]); terminal.theme.set('b_high', p.parts[2]) },
    'graphic': (p) => { terminal.theme.setImage(terminal.source.locate(p.str + '.jpg')) },
    // Edit
    'find': (p) => { terminal.cursor.find(p.str) },
    'select': (p) => { terminal.cursor.select(p.x, p.y, p.w, p.h) },
    'inject': (p) => { terminal.cursor.select(p._x, p._y); terminal.source.inject(p._str, true) },
    'write': (p) => { terminal.cursor.select(p._x, p._y, p._str.length); terminal.cursor.writeBlock([p._str.split('')]) }
  }

  // Make shorthands
  for (const id in this.actives) {
    this.actives[id.substr(0, 2)] = this.actives[id]
  }

  function Param (val) {
    this.str = `${val}`
    this.length = this.str.length
    this.chars = this.str.split('')
    this.int = !isNaN(val) ? parseInt(val) : null
    this.parts = val.split(';')
    this.x = parseInt(this.parts[0])
    this.y = parseInt(this.parts[1])
    this.w = parseInt(this.parts[2])
    this.h = parseInt(this.parts[3])
    // Optionals Position Style
    this._str = this.parts[0]
    this._x = parseInt(this.parts[1])
    this._y = parseInt(this.parts[2])
  }

  // Begin

  this.start = function (q = '') {
    this.isActive = true
    this.query = q
    terminal.update()
  }

  this.stop = function () {
    this.isActive = false
    this.query = ''
    this.historyIndex = this.history.length
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

  this.trigger = function (msg = this.query, touch = true) {
    const cmd = `${msg}`.split(':')[0].toLowerCase()
    const val = `${msg}`.substr(cmd.length + 1)
    if (!this.actives[cmd]) { console.warn('Commander', `Unknown message: ${msg}`); this.stop(); return }
    console.info('Commander', msg)
    this.actives[cmd](new Param(val), true)
    if (touch === true) {
      this.history.push(msg)
      this.historyIndex = this.history.length
      this.stop()
    }
  }

  this.preview = function (msg = this.query) {
    const cmd = `${msg}`.split(':')[0].toLowerCase()
    const val = `${msg}`.substr(cmd.length + 1)
    if (!this.passives[cmd]) { return }
    this.passives[cmd](new Param(val), false)
  }

  // Events

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
    if (event.keyCode === 86 && (event.metaKey || event.ctrlKey) && event.shiftKey) { terminal.cursor.paste(true); event.preventDefault(); return }
    if (event.keyCode === 86 && (event.metaKey || event.ctrlKey)) { terminal.cursor.paste(false); event.preventDefault(); return }
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
    if (event.key === ' ' && terminal.cursor.mode === 1) { terminal.cursor.move(1, 0); event.preventDefault(); return }

    if (event.key === 'Escape') { terminal.toggleGuide(false); terminal.commander.stop(); terminal.clear(); terminal.isPaused = false; terminal.cursor.reset(); return }
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
    // Navigate History
    if (this.isActive === true) {
      this.historyIndex -= this.historyIndex > 0 ? 1 : 0
      this.start(this.history[this.historyIndex])
      return
    }
    const leap = skip ? terminal.grid.h : 1
    terminal.toggleGuide(false)
    if (drag) {
      terminal.cursor.drag(0, leap)
    } else if (mod) {
      terminal.cursor.scale(0, leap)
    } else {
      terminal.cursor.move(0, leap)
    }
  }

  this.onArrowDown = function (mod = false, skip = false, drag = false) {
    // Navigate History
    if (this.isActive === true) {
      this.historyIndex += this.historyIndex < this.history.length ? 1 : 0
      this.start(this.history[this.historyIndex])
      return
    }
    const leap = skip ? terminal.grid.h : 1
    terminal.toggleGuide(false)
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
    terminal.toggleGuide(false)
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
    terminal.toggleGuide(false)
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
