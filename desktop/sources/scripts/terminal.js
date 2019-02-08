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
  this.keyboard = new Keyboard(this)

  this.history = new History()
  this.controller = new Controller()

  // Themes
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' })

  this.el = document.createElement('canvas')
  this.context = this.el.getContext('2d')
  this.size = { w: 0, h: 0, ratio: 0.5, grid: { w: 8, h: 8 } }
  this.isPaused = false
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
    this.history.bind(this.orca, 's')
    this.history.record(this.orca.s)
    this.setSpeed(120)
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
    const size = { w: (orca.w * this.size.ratio) * tile.w, h: (orca.h * this.size.ratio) * tile.h }
    this.history.reset()
    this.orca = orca
    this.setSize(size)
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

  this.setSize = function (size) {
    console.log(`Set Size: ${size.w}x${size.h}`)
    require('electron').remote.getCurrentWindow().setSize(parseInt(size.w + 60), parseInt(size.h + 60 + tile.h), false)
    this.resize()
  }

  this.modSpeed = function (mod = 0) {
    this.setSpeed(this.bpm + mod)
  }

  this.modGrid = function (x = 0, y = 0) {
    const w = clamp(this.size.grid.w + x, 4, 16)
    const h = clamp(this.size.grid.h + y, 4, 16)
    this.setGrid(w, h)
  }

  this.modZoom = function (mod = 0, set = false) {
    const { webFrame } = require('electron')
    const currentZoomFactor = webFrame.getZoomFactor()
    webFrame.setZoomFactor(set ? mod : currentZoomFactor + mod)
  }

  //

  this.isCursor = function (x, y) {
    return x === this.cursor.x && y === this.cursor.y
  }

  this.isSelection = function (x, y) {
    return !!(x >= this.cursor.x && x < this.cursor.x + this.cursor.w && y >= this.cursor.y && y < this.cursor.y + this.cursor.h)
  }

  this.portAt = function (x, y) {
    return this.ports[this.orca.indexAt(x, y)]
  }

  this.findPorts = function () {
    const a = new Array((this.orca.w * this.orca.h) - 1)
    for (const id in this.orca.runtime) {
      const operator = this.orca.runtime[id]
      if (this.orca.lockAt(operator.x, operator.y)) { continue }
      const ports = operator._ports()
      for (const i in ports) {
        const port = ports[i]
        const index = this.orca.indexAt(port[0], port[1])
        a[index] = port
      }
    }
    return a
  }

  // Canvas

  this.clear = function () {
    this.context.clearRect(0, 0, this.size.w, this.size.h + tile.h)
  }

  this.guide = function (x, y) {
    const g = this.orca.glyphAt(x, y)
    if (this.isCursor(x, y)) { return this.isPaused ? '~' : '@' }
    if (g !== '.') { return g }
    if (x % this.size.grid.w === 0 && y % this.size.grid.h === 0) { return '+' }
    return g
  }

  this.drawProgram = function () {
    for (let y = 0; y < this.orca.h; y++) {
      for (let x = 0; x < this.orca.w; x++) {
        const port = this.ports[this.orca.indexAt(x, y)]
        const glyph = this.guide(x, y)
        const style = this.isSelection(x, y) ? 4 : this.orca.lockAt(x, y) ? 5 : port ? port[2] : null
        this.drawSprite(x, y, glyph, style)
      }
    }
  }

  this.drawInterface = function () {
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

  this.drawSprite = function (x, y, g, style) {
    const ctx = this.context
    ctx.textAlign = 'center'

    const bgrect = { x: x * tile.w, y: (y) * tile.h, w: tile.w, h: tile.h }
    const fgrect = { x: (x + 0.5) * tile.w, y: (y + 1) * tile.h, w: tile.w, h: tile.h }

    let bg = null
    let fg = 'white'

    // Default
    if (style === 0) {
      bg = this.theme.active.b_med
      fg = this.theme.active.f_low
    }
    // Haste
    if (style === 1) {
      fg = this.theme.active.b_med
    }
    // Input
    if (style === 2) {
      fg = this.theme.active.b_high
    }
    // Output
    if (style === 3) {
      bg = this.theme.active.b_high
      fg = this.theme.active.f_low
    }
    // Selected
    if (style === 4) {
      bg = this.theme.active.b_inv
      fg = this.theme.active.f_inv
    }
    // Locked
    if (style === 5) {
      fg = this.theme.active.f_med
    }

    if (bg) {
      ctx.fillStyle = bg
      ctx.fillRect(bgrect.x, bgrect.y, bgrect.w, bgrect.h)
    }
    if (fg) {
      ctx.fillStyle = fg
      ctx.fillText(g, fgrect.x, fgrect.y)
    }
  }

  this.drawStyle = function () {

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

  this.resize = function () {
    const size = { w: window.innerWidth - 60, h: window.innerHeight - 60 }
    const tiles = { w: clamp(Math.floor(size.w / (tile.w * this.size.ratio)), 10, 80), h: clamp(Math.floor(size.h / (tile.h * this.size.ratio)), 10, 30) }

    if (this.orca.w === tiles.w && this.orca.h === tiles.h) { return }

    this.crop(tiles.w, tiles.h - 1)

    this.size.w = tile.w * this.orca.w
    this.size.h = tile.h * this.orca.h + tile.h

    console.log(`Resized to ${this.size.w}x${this.size.h}(${tiles.w}:${tiles.h})`)

    this.el.width = this.size.w
    this.el.height = this.size.h + tile.h
    this.el.style.width = `${parseInt(this.size.w * this.size.ratio)}px`
    this.el.style.height = `${parseInt(this.size.h * this.size.ratio)}px`

    this.context.textBaseline = 'bottom'
    this.context.font = `${tile.h * 0.75}px input_mono_medium`

    this.update()
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

    this.history.reset()
    this.orca.load(w, h, block, this.orca.f)
  }

  function step (v, val) { return Math.floor(v / val) * val }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
