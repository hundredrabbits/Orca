'use strict'

export default function Commander (terminal) {
  this.isActive = false
  this.query = ''
  this.history = []
  this.historyIndex = 0

  // Library

  this.passives = {
    'find': (val) => { terminal.cursor.find(val) },
    'select': (val) => { const rect = val.split(';'); terminal.cursor.select(rect[0], rect[1], rect[2], rect[3]) },
    'inject': (val) => { terminal.source.inject(val, false) },
    'rot': (val) => { terminal.cursor.rotate(parseInt(val)) },
    'write': (val) => { const parts = val.split(';'); terminal.cursor.select(parts[1], parts[2], parts[0].length) }
  }

  this.actives = {
    'osc': (val) => { terminal.io.osc.select(parseInt(val)) },
    'udp': (val) => { terminal.io.udp.select(parseInt(val)) },
    'copy': (val) => { terminal.cursor.copy() },
    'paste': (val) => { terminal.cursor.paste(true) },
    'erase': (val) => { terminal.cursor.erase() },
    'play': (val) => { terminal.clock.play() },
    'stop': (val) => { terminal.clock.stop() },
    'run': (val) => { terminal.run() },
    'apm': (val) => { terminal.clock.set(null, parseInt(val)) },
    'bpm': (val) => { terminal.clock.set(parseInt(val), parseInt(val), true) },
    'time': (val) => { terminal.clock.setFrame(parseInt(val)) },
    'rewind': (val) => { terminal.clock.setFrame(terminal.orca.f - parseInt(val)) },
    'skip': (val) => { terminal.clock.setFrame(terminal.orca.f + parseInt(val)) },
    'color': (val) => { const parts = val.split(';'); terminal.theme.set('b_med', parts[0]); terminal.theme.set('b_inv', parts[1]); terminal.theme.set('b_high', parts[2]) },
    'graphic': (val) => { terminal.theme.setImage(terminal.source.locate(val + '.jpg')) },
    'inject': (val) => { terminal.source.inject(val, true) },
    'write': (val) => { const parts = val.split(';'); terminal.cursor.select(parts[1], parts[2], parts[0].length); terminal.cursor.writeBlock([parts[0].split('')]) }
  }

  // Make shorthands
  for (const id in this.actives) {
    this.actives[id.substr(0, 2)] = this.actives[id]
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

  this.trigger = function (msg = this.query) {
    const cmd = `${msg}`.split(':')[0].toLowerCase()
    const val = `${msg}`.substr(cmd.length + 1)
    if (!this.actives[cmd]) { console.warn(`Unknown message: ${msg}`); this.stop(); return }
    console.info('Commander', msg)
    this.actives[cmd](val, true)
    this.history.push(msg)
    this.historyIndex = this.history.length
    this.stop()
  }

  this.preview = function (msg = this.query) {
    const cmd = `${msg}`.split(':')[0].toLowerCase()
    const val = `${msg}`.substr(cmd.length + 1)
    if (!this.passives[cmd]) { return }
    this.passives[cmd](val, false)
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
