'use strict'

function Terminal (orca, tile = { w: 20, h: 30 }) {
  const Cursor = require('./cursor')
  const Source = require('./source')
  const Midi = require('./midi')

  this.midi = new Midi(this)
  this.cursor = new Cursor(orca, this)
  this.source = new Source(orca, this)
  this.controller = new Controller()
  this.theme = new Theme({ background: '#111111', f_high: '#ffffff', f_med: '#777777', f_low: '#333333', f_inv: '#000000', b_high: '#ffb545', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffffff' })

  this.el = document.createElement('canvas')
  this.size = { width: tile.w * orca.w, height: tile.h * orca.h + (tile.h * 3), ratio: 0.5, grid: { w: 8, h: 8 } }
  this.isPaused = false
  this.timer = null
  this.bpm = 120
  this.debug = 'Idle.'

  this.install = function (host) {
    this.resize()
    host.appendChild(this.el)
    this.theme.install(host)
  }

  this.start = function () {
    orca.start()
    this.theme.start()
    this.midi.start()

    this.update()
    this.setSpeed(120)
    this.el.className = 'ready'
  }

  this.run = function () {
    if (this.isPaused) { return }

    this.midi.clear()
    this.clear()

    orca.run()
    this.midi.run()
    this.update()
  }

  this.pause = function () {
    this.isPaused = !this.isPaused
    this.log(this.isPaused ? 'Paused' : 'Unpaused')
    this.update()
  }

  this.load = function (data) {
    const w = data.split('\n')[0].length
    const h = data.split('\n').length
    this.log(`Loading ${w}x${h}`)
    orca.load(w, h, data)
    this.resize()
    this.update()
  }

  this.update = function () {
    this.clear()
    this.ports = this.findPorts()
    this.drawProgram()
    this.drawInterface()
  }

  this.reset = function () {
    this.theme.reset()
  }

  //

  this.setSpeed = function (bpm) {
    this.bpm = clamp(bpm, 60, 300)
    this.log(`Changed speed to ${this.bpm}.`)
    const ms = (60000 / bpm) / 4
    clearInterval(this.timer)
    this.timer = setInterval(() => { this.run() }, ms)
  }

  this.modSpeed = function (mod = 0) {
    this.setSpeed(this.bpm + mod)
  }

  this.modGrid = function (x = 0, y = 0) {
    this.size.grid.w = clamp(this.size.grid.w + x, 4, 16)
    this.size.grid.h = clamp(this.size.grid.h + y, 4, 16)
  }

  //

  this.log = function (msg) {
    this.debug = msg
  }

  //

  this.isCursor = function (x, y) {
    return x === this.cursor.x && y === this.cursor.y
  }

  this.isSelection = function (x, y) {
    return !!(x >= this.cursor.x && x < this.cursor.x + this.cursor.w && y >= this.cursor.y && y < this.cursor.y + this.cursor.h)
  }

  this.portAt = function (x, y, req = null) {
    return this.ports[`${x}:${y}`]
  }

  this.findPorts = function () {
    const h = {}
    for (const id in orca.runtime) {
      const g = orca.runtime[id]
      if (orca.lockAt(g.x, g.y)) { continue }
      // Default/Passive
      h[`${g.x}:${g.y}`] = { type: g.passive && g.draw ? 'passive' : 'none', name: `${g.name}` }
      // Output
      if (g.ports.output) { h[`${g.x + g.ports.output.x}:${g.y + g.ports.output.y}`] = { type: 'output', name: `${g.glyph}.out` } }
      // Haste
      for (const id in g.ports.haste) {
        const port = g.ports.haste[id]
        h[`${g.x + port.x}:${g.y + port.y}`] = { type: 'haste', name: `${g.glyph}'${id}` }
      }
      // Input
      for (const id in g.ports.input) {
        const port = g.ports.input[id]
        h[`${g.x + port.x}:${g.y + port.y}`] = { type: 'input', name: `${g.glyph}:${id}` }
      }
    }
    return h
  }

  // Canvas

  this.context = function () {
    return this.el.getContext('2d')
  }

  this.clear = function () {
    this.context().clearRect(0, 0, this.size.width, this.size.height)
  }

  this.guide = function (x, y) {
    const g = orca.glyphAt(x, y)
    if (g !== '.') { return g }
    if (this.cursor.w === 1 && this.cursor.h === 1) { return g }
    if (x % this.size.grid.w === 0 && y % this.size.grid.h === 0) { return '+' }
    return g
  }

  this.drawProgram = function () {
    for (let y = 0; y < orca.h; y++) {
      for (let x = 0; x < orca.w; x++) {
        const port = this.ports[`${x}:${y}`]
        const styles = { isSelection: this.isSelection(x, y), isCursor: this.isCursor(x, y), isPort: port ? port.type : false, isLocked: orca.lockAt(x, y) }
        this.drawSprite(x, y, this.guide(x, y), styles)
      }
    }
  }

  this.drawInterface = function () {
    const col = this.size.grid.w
    // Cursor
    this.write(`${this.cursor.x},${this.cursor.y}`, col * 0, 1, this.size.grid.w)
    this.write(`${this.cursor.w}:${this.cursor.h}`, col * 1, 1, this.size.grid.w)
    this.write(`${this.cursor._mode()}`, col * 2, 1, this.size.grid.w)
    this.write(`${this.cursor._inspect()}`, col * 3, 1, this.size.grid.w)
    this.write(this.debug, col * 4, 1)
    // Grid
    this.write(`${orca.w}x${orca.h}`, col * 0, 0, this.size.grid.w)
    this.write(`${this.size.grid.w}/${this.size.grid.h}`, col * 1, 0, this.size.grid.w)
    this.write(`f${orca.f}`, col * 2, 0, this.size.grid.w)
    this.write(`${this.source}`, col * 3, 0, this.size.grid.w)
    this.write(`${this.bpm}`, col * 4, 0, this.size.grid.w)
    this.write(`${this.midi}`, col * 5, 0, this.size.grid.w)
  }

  this.drawSprite = function (x, y, g, styles = { isCursor: false, isSelection: false, isPort: false }) {
    const ctx = this.context()

    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.font = `${tile.h * 0.75}px input_mono_medium`

    if (styles.isSelection) {
      ctx.fillStyle = this.theme.active.b_inv
      ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
      ctx.fillStyle = this.theme.active.f_inv
    } else if (styles.isPort) {
      if (styles.isPort === 'output') { // Output
        ctx.fillStyle = this.theme.active.b_high
        ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
        ctx.fillStyle = this.theme.active.f_low
      } else if (styles.isPort === 'input') { // Input
        ctx.fillStyle = this.theme.active.background
        ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
        ctx.fillStyle = this.theme.active.b_high
      } else if (styles.isPort === 'passive') { // Passive
        ctx.fillStyle = this.theme.active.b_med
        ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
        ctx.fillStyle = this.theme.active.f_low
      } else if (styles.isPort === 'haste') { // Haste
        ctx.fillStyle = this.theme.active.background
        ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
        ctx.fillStyle = this.theme.active.b_med
      } else {
        ctx.fillStyle = this.theme.active.background
        ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
        ctx.fillStyle = this.theme.active.f_med
      }
    } else if (styles.isLocked) {
      ctx.fillStyle = this.theme.active.background
      ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
      ctx.fillStyle = this.theme.active.f_med
    } else {
      ctx.fillStyle = this.theme.active.f_high
    }
    ctx.fillText(styles.isCursor && g === '.' ? (!this.isPaused ? '@' : '~') : g, (x + 0.5) * tile.w, (y + 1) * tile.h)
  }

  this.write = function (text, offsetX, offsetY, limit) {
    let x = 0
    while (x < text.length && x < limit - 1) {
      const c = text.substr(x, 1)
      this.drawSprite(offsetX + x, orca.h + offsetY, c)
      x += 1
    }
  }

  this.resize = function () {
    this.size.width = tile.w * orca.w
    this.size.height = tile.h * orca.h + (tile.h * 3)
    this.el.width = this.size.width
    this.el.height = this.size.height + tile.h
    this.el.style.width = (this.size.width * this.size.ratio) + 'px'
    this.el.style.height = (this.size.height * this.size.ratio) + 'px'

    const { remote } = require('electron')
    const win = remote.getCurrentWindow()
    const width = parseInt((this.size.width * this.size.ratio) + 60)
    const height = parseInt((this.size.height * this.size.ratio) + 30)

    win.setSize(width, height, true)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
