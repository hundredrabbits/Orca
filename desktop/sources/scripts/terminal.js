'use strict'

function Terminal () {
  const Orca = require('../../core/orca')
  const Cursor = require('./cursor')
  const Source = require('./source')
  const History = require('./history')
  const Keyboard = require('./keyboard')
  const IO = require('./io')
  const Clock = require('./clock')

  this.library = require('../../core/library')

  this.io = new IO(this)
  this.cursor = new Cursor(this)
  this.source = new Source(this)
  this.keyboard = new Keyboard(this)

  this.history = new History()
  this.controller = new Controller()
  this.clocks = [new Clock(120)]
  this.selectedClock = -1

  // Themes
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' })

  this.el = document.createElement('canvas')
  this.context = this.el.getContext('2d')
  this.size = { w: 0, h: 0, ratio: 0.5, grid: { w: 8, h: 8 } }
  this.isPaused = false

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
    this.nextClock()
    this.update()
    this.el.className = 'ready'
  }

  this.clock = function () {
    return this.clocks[this.selectedClock]
  }

  this.run = function () {
    this.io.clear()
    this.orca.run()
    this.io.run()
    this.update()
  }

  this.pause = function () {
    this.isPaused = !this.isPaused
    console.log(this.isPaused ? 'Paused' : 'Unpaused')
    this.update()
    this.clock().setRunning(!this.isPaused)
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

  this.nextClock = function () {
    const previousClock = this.clock()
    if (previousClock) {
      previousClock.setRunning(false)
      previousClock.setCallback(() => {})
    }
    this.selectedClock = (this.selectedClock + 1) % this.clocks.length
    this.clock().setRunning(!this.isPaused)
    this.clock().setCallback(() => this.run())

    console.log('Select clock:', this.clock())
    this.update()
  }

  this.setSpeed = function (bpm) {
    if (this.clock().canSetBpm()) {
      bpm = clamp(bpm, 60, 300)
      console.log(`Change Speed: ${bpm}.`)
      this.clock().setBpm(bpm)
      this.update()
    }
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
    if (this.clock().canSetBpm()) {
      this.setSpeed(this.clock().getBpm() + mod)
    }
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
      const ports = operator.getPorts()
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
    if (g !== '.') { return g }
    if (this.isCursor(x, y)) { return this.isPaused ? '~' : '@' }
    if (x % this.size.grid.w === 0 && y % this.size.grid.h === 0) { return '+' }
    return g
  }

  this.drawProgram = function () {
    for (let y = 0; y < this.orca.h; y++) {
      for (let x = 0; x < this.orca.w; x++) {
        const port = this.ports[this.orca.indexAt(x, y)]
        const glyph = this.guide(x, y)
        const style = this.isSelection(x, y) ? 4 : port ? port[2] : this.orca.lockAt(x, y) ? 5 : null
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
    this.write(`${this.clock()}${this.orca.f % 4 === 0 ? '*' : ''}`, col * 3, 0, this.size.grid.w)
    this.write(`${this.io}`, col * 4, 0, this.size.grid.w)
  }

  this.drawSprite = function (x, y, g, type) {
    const style = this.drawStyle(type)
    if (style.bg) {
      const bgrect = { x: x * tile.w, y: (y) * tile.h, w: tile.w, h: tile.h }
      this.context.fillStyle = style.bg
      this.context.fillRect(bgrect.x, bgrect.y, bgrect.w, bgrect.h)
    }
    if (style.fg) {
      const fgrect = { x: (x + 0.5) * tile.w, y: (y + 1) * tile.h, w: tile.w, h: tile.h }
      this.context.fillStyle = style.fg
      this.context.fillText(g, fgrect.x, fgrect.y)
    }
  }

  this.drawStyle = function (type) {
    // Operator
    if (type === 0) { return { bg: this.theme.active.b_med, fg: this.theme.active.f_low } }
    // Haste
    if (type === 1) { return { fg: this.theme.active.b_med } }
    // Input
    if (type === 2) { return { fg: this.theme.active.b_high } }
    // Output
    if (type === 3) { return { bg: this.theme.active.b_high, fg: this.theme.active.f_low } }
    // Selected
    if (type === 4) { return { bg: this.theme.active.b_inv, fg: this.theme.active.f_inv } }
    // Locked
    if (type === 5) { return { fg: this.theme.active.f_med } }
    // Default
    return { fg: this.theme.active.f_low }
  }

  this.write = function (text, offsetX, offsetY, limit) {
    let x = 0
    while (x < text.length && x < limit - 1) {
      this.drawSprite(offsetX + x, this.orca.h + offsetY, text.substr(x, 1), 2)
      x += 1
    }
  }

  // Resize tools

  this.resize = function () {
    const size = { w: window.innerWidth - 60, h: window.innerHeight - 70 }
    const tiles = { w: Math.floor(size.w / (tile.w * this.size.ratio)), h: Math.floor(size.h / (tile.h * this.size.ratio)) }

    if (this.orca.w === tiles.w && this.orca.h === tiles.h) { return }

    // Limit Tiles to Bounds
    const bounds = this.orca.bounds()
    if (tiles.w <= bounds.w) { tiles.w = bounds.w + 1 }
    if (tiles.h <= bounds.h) { tiles.h = bounds.h + 1 }

    this.crop(tiles.w, tiles.h)

    this.size.w = tile.w * this.orca.w
    this.size.h = tile.h * this.orca.h + tile.h

    // Keep cursor in bounds
    if (this.cursor.x >= tiles.w) { this.cursor.x = tiles.w - 1 }
    if (this.cursor.y >= tiles.h) { this.cursor.y = tiles.h - 1 }

    console.log(`Resized to ${this.size.w}x${this.size.h}(${tiles.w}:${tiles.h})`)

    this.el.width = this.size.w
    this.el.height = this.size.h + tile.h
    this.el.style.width = `${parseInt(this.size.w * this.size.ratio)}px`
    this.el.style.height = `${parseInt(this.size.h * this.size.ratio)}px`

    this.context.textBaseline = 'bottom'
    this.context.textAlign = 'center'
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

  this.docs = function () {
    return Object.keys(this.library).reduce((acc, id) => { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(id) < 0 ? `${acc}- ${new this.library[id]().docs()}\n` : acc }, '')
  }

  function step (v, val) { return Math.floor(v / val) * val }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
