'use strict'

function Terminal (orca, tile = { w: 20, h: 30 }) {
  const Cursor = require('./cursor')
  const Source = require('./source')
  const History = require('./history')
  const IO = require('./io')

  this.io = new IO(this)
  this.cursor = new Cursor(orca, this)
  this.source = new Source(orca, this)
  this.history = new History(orca, this)
  this.controller = new Controller()

  // Themes
  const noir = { background: '#111111', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' }
  const pale = { background: '#eeeeee', f_high: '#222222', f_med: '#444444', f_low: '#cccccc', f_inv: '#000000', b_high: '#000000', b_med: '#333333', b_low: '#dddddd', b_inv: '#72dec2' }

  this.theme = new Theme(noir, pale)

  this.el = document.createElement('canvas')
  this.size = { width: tile.w * orca.w, height: tile.h * orca.h + (tile.h * 3), ratio: 0.5, grid: { w: 8, h: 8 } }
  this.isPaused = false
  this.timer = null
  this.bpm = 120

  this.install = function (host) {
    this.resize()
    host.appendChild(this.el)
    this.theme.install(host)
  }

  this.start = function () {
    this.theme.start()
    this.io.start()
    this.history.record()
    this.setSpeed(120)
    this.update()
    this.el.className = 'ready'
  }

  this.run = function () {
    if (this.isPaused) { return }
    this.io.clear()
    orca.run()
    this.io.run()
    this.update()
  }

  this.pause = function () {
    this.isPaused = !this.isPaused
    console.log(this.isPaused ? 'Paused' : 'Unpaused')
    this.update()
  }

  this.load = function (data) {
    if(!data){ return }
    const w = data.split('\n')[0].length
    const h = data.split('\n').length
    console.log(`Loading ${w}x${h}`)
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
    console.log(`Changed speed to ${this.bpm}.`)
    clearInterval(this.timer)
    this.timer = setInterval(() => { this.run() }, (60000 / bpm) / 4)
  }

  this.modSpeed = function (mod = 0) {
    this.setSpeed(this.bpm + mod)
    this.update()
  }

  this.modGrid = function (x = 0, y = 0) {
    this.size.grid.w = clamp(this.size.grid.w + x, 4, 16)
    this.size.grid.h = clamp(this.size.grid.h + y, 4, 16)
    this.update()
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
    this.write(`${this.cursor.inspect()}`, col * 2, 1, this.size.grid.w)
    this.write(`${this.source}${this.cursor.mode === 1 ? '+' : ''}`, col * 3, 1, this.size.grid.w)
    // Grid
    this.write(`${orca.w}x${orca.h}`, col * 0, 0, this.size.grid.w)
    this.write(`${this.size.grid.w}/${this.size.grid.h}`, col * 1, 0, this.size.grid.w)
    this.write(`${orca.f}f${this.isPaused ? '*' : ''}`, col * 2, 0, this.size.grid.w)
    this.write(`${this.bpm}${orca.f % 4 === 0 ? '*' : ''}`, col * 3, 0, this.size.grid.w)
    this.write(`${this.io}`, col * 4, 0, this.size.grid.w)
  }

  this.drawSprite = function (x, y, g, styles = { isCursor: false, isSelection: false, isPort: false, f: null, b: null }) {
    const ctx = this.context()

    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.font = `${tile.h * 0.75}px input_mono_medium`

    if (styles.f && styles.b && this.theme.active[styles.f] && this.theme.active[styles.b]) {
      ctx.fillStyle = this.theme.active[styles.b]
      ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
      ctx.fillStyle = this.theme.active[styles.f]
    } else if (styles.isSelection) {
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
        ctx.fillStyle = this.theme.active.f_high
      }
    } else if (styles.isLocked) {
      ctx.fillStyle = this.theme.active.background
      ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
      ctx.fillStyle = this.theme.active.f_med
    } else {
      ctx.fillStyle = this.theme.active.f_low
    }
    ctx.fillText(styles.isCursor && g === '.' ? (!this.isPaused ? '@' : '~') : g, (x + 0.5) * tile.w, (y + 1) * tile.h)
  }

  this.write = function (text, offsetX, offsetY, limit) {
    let x = 0
    while (x < text.length && x < limit - 1) {
      const c = text.substr(x, 1)
      this.drawSprite(offsetX + x, orca.h + offsetY, c, { f: 'f_high', b: 'background' })
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
