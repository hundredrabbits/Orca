'use strict'

function Commander (client) {
  this.isActive = false
  this.query = ''
  this.history = []
  this.historyIndex = 0

  // Library

  this.passives = {
    find: (p) => { client.cursor.find(p.str) },
    select: (p) => { client.cursor.select(p.x, p.y, p.w, p.h) },
    inject: (p) => {
      client.cursor.select(p._x, p._y)
      if (client.source.cache[p._str + '.orca']) {
        const lines = client.source.cache[p._str + '.orca'].trim().split('\n')
        client.cursor.resize(lines[0].length - 1, lines.length - 1)
      }
    },
    write: (p) => { client.cursor.select(p._x, p._y, p._str.length) }
  }

  this.actives = {
    // Ports
    osc: (p) => { client.io.osc.select(p.int) },
    udp: (p) => { client.io.udp.select(p.int) },
    ip: (p) => { client.io.setIp(p.str) },
    cc: (p) => { client.io.cc.setOffset(p.int) },
    pg: (p) => { client.io.cc.stack.push({ channel: clamp(p.ints[0], 0, 15), bank: p.ints[1], sub: p.ints[2], pgm: clamp(p.ints[3], 0, 127), type: 'pg' }); client.io.cc.run() },
    // Cursor
    copy: (p) => { client.cursor.copy() },
    paste: (p) => { client.cursor.paste(true) },
    erase: (p) => { client.cursor.erase() },
    // Controls
    play: (p) => { client.clock.play() },
    stop: (p) => { client.clock.stop() },
    run: (p) => { client.run() },
    // Speed
    apm: (p) => { client.clock.setSpeed(null, p.int) },
    bpm: (p) => { client.clock.setSpeed(p.int, p.int, true) },
    time: (p) => { client.clock.setFrame(p.int) },
    rewind: (p) => { client.clock.setFrame(client.orca.f - p.int) },
    skip: (p) => { client.clock.setFrame(client.orca.f + p.int) },
    // Effects
    rot: (p) => { client.cursor.rotate(p.int) },
    // Themeing
    color: (p) => {
      if (p.parts[0]) { client.theme.set('b_inv', p.parts[0]) }
      if (p.parts[1]) { client.theme.set('b_inv', p.parts[1]) }
      if (p.parts[2]) { client.theme.set('b_high', p.parts[2]) }
    },
    // Edit
    find: (p) => { client.cursor.find(p.str) },
    select: (p) => { client.cursor.select(p.x, p.y, p.w, p.h) },
    inject: (p) => {
      client.cursor.select(p._x, p._y)
      if (client.source.cache[p._str + '.orca']) {
        const lines = client.source.cache[p._str + '.orca'].trim().split('\n')
        client.cursor.writeBlock(lines)
        client.cursor.reset()
      }
    },
    write: (p) => { client.cursor.select(p._x, p._y, p._str.length); client.cursor.writeBlock([p._str.split('')]) }
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
    client.update()
  }

  this.stop = () => {
    this.isActive = false
    this.query = ''
    this.historyIndex = this.history.length
    client.update()
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
    client[tool].trigger()
    client.update()
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
    client[this.isActive === true ? 'commander' : 'cursor'].write(e.key)
    e.stopPropagation()
  }

  this.onKeyUp = (e) => {
    client.update()
  }

  // UI

  this.toString = function () {
    return `${this.query}`
  }

  // Utils

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
