'use strict'

function Commander (terminal) {
  this.isActive = false
  this.query = ''
  this.history = []
  this.historyIndex = 0

  // Library

  this.passives = {
    find: (p) => { terminal.cursor.find(p.str) },
    select: (p) => { terminal.cursor.select(p.x, p.y, p.w, p.h) },
    inject: (p) => {
      terminal.cursor.select(p._x, p._y)
      if (terminal.source.cache[p._str + '.orca']) {
        const lines = terminal.source.cache[p._str + '.orca'].trim().split('\n')
        terminal.cursor.resize(lines[0].length - 1, lines.length - 1)
      }
    },
    write: (p) => { terminal.cursor.select(p._x, p._y, p._str.length) }
  }

  this.actives = {
    // Ports
    osc: (p) => { terminal.io.osc.select(p.int) },
    udp: (p) => { terminal.io.udp.select(p.int) },
    ip: (p) => { terminal.io.setIp(p.str) },
    cc: (p) => { terminal.io.cc.setOffset(p.int) },
    pg: (p) => { terminal.io.cc.stack.push({ channel: clamp(p.ints[0], 0, 15), bank: p.ints[1], sub: p.ints[2], pgm: clamp(p.ints[3], 0, 127), type: 'pg' }); terminal.io.cc.run() },
    // Cursor
    copy: (p) => { terminal.cursor.copy() },
    paste: (p) => { terminal.cursor.paste(true) },
    erase: (p) => { terminal.cursor.erase() },
    // Controls
    play: (p) => { terminal.clock.play() },
    stop: (p) => { terminal.clock.stop() },
    run: (p) => { terminal.run() },
    // Speed
    apm: (p) => { terminal.clock.setSpeed(null, p.int) },
    bpm: (p) => { terminal.clock.setSpeed(p.int, p.int, true) },
    time: (p) => { terminal.clock.setFrame(p.int) },
    rewind: (p) => { terminal.clock.setFrame(terminal.orca.f - p.int) },
    skip: (p) => { terminal.clock.setFrame(terminal.orca.f + p.int) },
    // Effects
    rot: (p) => { terminal.cursor.rotate(p.int) },
    // Themeing
    color: (p) => { terminal.theme.set('b_med', p.parts[0]); terminal.theme.set('b_inv', p.parts[1]); terminal.theme.set('b_high', p.parts[2]) },
    // Edit
    find: (p) => { terminal.cursor.find(p.str) },
    select: (p) => { terminal.cursor.select(p.x, p.y, p.w, p.h) },
    inject: (p) => {
      terminal.cursor.select(p._x, p._y)
      if (terminal.source.cache[p._str + '.orca']) {
        const lines = terminal.source.cache[p._str + '.orca'].trim().split('\n')
        terminal.cursor.writeBlock(lines)
        terminal.cursor.reset()
      }
    },
    write: (p) => { terminal.cursor.select(p._x, p._y, p._str.length); terminal.cursor.writeBlock([p._str.split('')]) }
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
    this.ints = this.parts.map((val) => { return parseInt(val) })
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

  this.start = (q = '') => {
    this.isActive = true
    this.query = q
    terminal.update()
  }

  this.stop = () => {
    this.isActive = false
    this.query = ''
    this.historyIndex = this.history.length
    terminal.update()
  }

  this.erase = function () {
    this.query = this.query.slice(0, -1)
    this.preview()
  }

  this.write = (key) => {
    if (key === 'Backspace') { this.erase(); return }
    if (key === 'Enter') { this.run(); return }
    if (key === 'Escape') { this.stop(); return }
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

  this.onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) { return }
    terminal[this.isActive === true ? 'commander' : 'cursor'].write(e.key)
    e.stopPropagation()
  }

  this.onKeyUp = (e) => {
    terminal.update()
  }

  // UI

  this.toString = function () {
    return `${this.query}`
  }

  // Utils

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
