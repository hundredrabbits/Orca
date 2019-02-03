'use strict'

function Terminal () {
  const Orca = require('../../core/orca')
  const Cursor = require('./cursor')
  const Source = require('./source')
  const History = require('./history')
  const Keyboard = require('./keyboard')
  const IO = require('./io')

  this.library = require('../../core/library')

  this.io = new IO(this)
  this.cursor = new Cursor(this)
  this.source = new Source(this)
  this.history = new History(this)
  this.keyboard = new Keyboard(this)
  this.controller = new Controller()

  // Themes
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' })
  this.window = require('electron').remote.getCurrentWindow()

  this.el = document.createElement('canvas')
  this.context = this.el.getContext('2d')
  this.size = { w: 0, h: 0, ratio: 1, grid: { w: 8, h: 8 } }
  this.isPaused = false
  this.showInterface = true
  this.timer = null
  this.bpm = 120

  const tile = { w: 10 / this.size.ratio, h: 15 / this.size.ratio }

  this.install = function (host) {
    host.appendChild(this.el)
    this.theme.install(host)
  }

  this.start = function () {
    this.theme.start()
    this.io.start()
    this.source.new()
    this.history.record()
    this.setSpeed(120)
    this.resize()
    this.update()
    this.el.className = 'ready'
  }

  this.run = function () {
    if (this.isPaused) { return }
    this.io.clear()
    this.orca.run()
    this.io.run()
    this.update()
  }

  this.pause = function () {
    this.isPaused = !this.isPaused
    console.log(this.isPaused ? 'Paused' : 'Unpaused')
    this.update()
  }

  this.load = function (orca, frame = 0) {
    this.history.reset()
    this.orca = orca
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
    this.update()
  }

  this.setGrid = function (w, h) {
    this.size.grid.w = w
    this.size.grid.h = h
    this.update()
  }

  this.modSpeed = function (mod = 0) {
    this.setSpeed(this.bpm + mod)
  }

  this.modGrid = function (x = 0, y = 0) {
    const w = clamp(this.size.grid.w + x, 4, 16)
    const h = clamp(this.size.grid.h + y, 4, 16)
    this.setGrid(w, h)
  }

  this.modSize = function (x = 0, y = 0) {
    const w = ((parseInt(this.orca.w / this.size.grid.w) + x) * this.size.grid.w) + 1
    const h = ((parseInt(this.orca.h / this.size.grid.h) + y) * this.size.grid.h) + 1
    this.setSize(w, h)
  }

  this.modZoom = function (mod = 0, set = false) {
    const { webFrame } = require('electron')
    const currentZoomFactor = webFrame.getZoomFactor()
    webFrame.setZoomFactor(set ? mod : currentZoomFactor + mod)
  }

  this.toggleInterface = function () {
    this.showInterface = this.showInterface !== true
  }

  this.toggleBackground = function () {
    document.body.className = document.body.className === 'transparent' ? '' : 'transparent'
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
    for (const id in this.orca.runtime) {
      const g = this.orca.runtime[id]
      if (this.orca.lockAt(g.x, g.y)) { continue }
      if (!h[`${g.x}:${g.y}`]) {
        h[`${g.x}:${g.y}`] = { type: g.passive && g.draw ? 'passive' : 'none', name: `${g.name}` }
      }
      for (const id in g.ports.haste) {
        const port = g.ports.haste[id]
        h[`${g.x + port.x}:${g.y + port.y}`] = { type: 'haste', name: `${g.glyph}'${id}` }
      }
      for (const id in g.ports.input) {
        const port = g.ports.input[id]
        h[`${g.x + port.x}:${g.y + port.y}`] = { type: 'input', name: `${g.glyph}:${id}` }
      }
      if (g.ports.output) { h[`${g.x + g.ports.output.x}:${g.y + g.ports.output.y}`] = { type: 'output', name: `${g.glyph}.out` } }
    }
    if (this.orca.host) {
      h[`0:0`] = { type: 'input', name: `${this.orca.id}:input` }
      h[`${this.orca.w - 1}:${this.orca.h - 1}`] = { type: 'output', name: `${this.orca.id}.output` }
    }
    return h
  }

  // Canvas

  this.clear = function () {
    this.context.clearRect(0, 0, this.size.w, this.size.h)
  }

  this.guide = function (x, y) {
    const g = this.orca.glyphAt(x, y)
    if (g !== '.') { return g }
    if (x % this.size.grid.w === 0 && y % this.size.grid.h === 0) { return '+' }
    return g
  }

  this.drawProgram = function () {
    for (let y = 0; y < this.orca.h; y++) {
      for (let x = 0; x < this.orca.w; x++) {
        const port = this.ports[`${x}:${y}`]
        const glyph = this.guide(x, y)
        const isCursor = this.isCursor(x, y)
        if (this.showInterface === false && glyph === '.' && !isCursor) { continue }
        const styles = { isSelection: this.isSelection(x, y), isCursor: isCursor, isPort: port ? port.type : false, isLocked: this.orca.lockAt(x, y) }
        this.drawSprite(x, y, glyph, styles)
      }
    }
  }

  this.drawInterface = function () {
    if (this.showInterface !== true) { return }

    const col = this.size.grid.w
    // Cursor
    this.write(`${this.cursor.x},${this.cursor.y}`, col * 0, 1, this.size.grid.w)
    this.write(`${this.cursor.w}:${this.cursor.h}`, col * 1, 1, this.size.grid.w)
    this.write(`${this.cursor.inspect()}`, col * 2, 1, this.size.grid.w)
    this.write(`${this.source}${this.cursor.mode === 2 ? '^' : this.cursor.mode === 1 ? '+' : ''}`, col * 3, 1, this.size.grid.w)
    this.write(`${this.io.midi}`, col * 4, 1, this.size.grid.w * 2)

    // Grid
    this.write(`${this.orca.w}x${this.orca.h}`, col * 0, 0, this.size.grid.w)
    this.write(`${this.size.grid.w}/${this.size.grid.h}`, col * 1, 0, this.size.grid.w)
    this.write(`${this.orca.f}f${this.isPaused ? '*' : ''}`, col * 2, 0, this.size.grid.w)
    this.write(`${this.bpm}${this.orca.f % 4 === 0 ? '*' : ''}`, col * 3, 0, this.size.grid.w)
    this.write(`${this.io}`, col * 4, 0, this.size.grid.w)
  }

  this.drawSprite = function (x, y, g, styles = { isCursor: false, isSelection: false, isPort: false, f: null, b: null }) {
    const ctx = this.context

    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.font = `${tile.h * 0.75}px input_mono_medium`

    // Highlight Variables
    if (g === 'V' && this.cursor.read() === 'V') {
      ctx.fillStyle = this.theme.active.b_inv
      ctx.fillRect(x * tile.w, (y) * tile.h, tile.w, tile.h)
      ctx.fillStyle = this.theme.active.background
    } else if (styles.f && styles.b && this.theme.active[styles.f] && this.theme.active[styles.b]) {
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
      ctx.fillStyle = this.theme.active.f_med
    } else {
      ctx.fillStyle = this.theme.active.f_low
    }
    ctx.fillText(styles.isCursor && (g === '.' || g === '+') ? (!this.isPaused ? '@' : '~') : g, (x + 0.5) * tile.w, (y + 1) * tile.h)
  }

  this.write = function (text, offsetX, offsetY, limit) {
    let x = 0
    while (x < text.length && x < limit - 1) {
      const c = text.substr(x, 1)
      this.drawSprite(offsetX + x, this.orca.h + offsetY, c, { f: 'f_high', b: 'background' })
      x += 1
    }
  }

  // Resize tools

  this.resize = function (resizeWindow = true) {
    const size = this.getSize()
    const tiles = { w: clamp(Math.floor(size.w / (tile.w * this.size.ratio)), 10, 80), h: clamp(Math.floor(size.h / (tile.h * this.size.ratio)), 10, 30) }

    if (this.orca.w === tiles.w && this.orca.h === tiles.h) { return }

    this.crop(tiles.w, tiles.h - 1)

    this.size.w = tile.w * this.orca.w
    this.size.h = tile.h * this.orca.h + tile.h

    console.log(`Size: ${this.size.w}x${this.size.h}(${tiles.w}:${tiles.h})`)

    this.el.width = this.size.w
    this.el.height = this.size.h + tile.h
    this.el.style.width = `${parseInt(this.size.w * this.size.ratio)}px`
    this.el.style.height = `${parseInt(this.size.h * this.size.ratio)}px`
  }

  this.crop = function (w, h) {
    let block = `${this.orca}`
    if (h > this.orca.h) {
      block = `${block}${`\n${'.'.repeat(this.orca.w)}`.repeat((h - this.orca.h))}`
    } else if (h < this.orca.h) {
      block = `${block}`.split('\n').slice(0, (h - this.orca.h)).join('\n').trim()
    }

    if (w > this.orca.w) {
      block = `${block}`.split('\n').map((val) => { return val + ('.').repeat((w - this.orca.w)) }).join('\n').trim()
    } else if (w < this.orca.w) {
      block = `${block}`.split('\n').map((val) => { return val.substr(0, val.length + (w - this.orca.w)) }).join('\n').trim()
    }

    this.orca.load(w, h, block, this.orca.f)
  }

  this.getSize = function () {
    const size = this.window.getSize()
    return { w: size[0] - 60, h: size[1] - 60 }
  }

  function step (v, val) { return Math.floor(v / val) * val }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
