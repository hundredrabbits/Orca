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

  this.orca = new Orca()
  this.io = new IO(this)
  this.cursor = new Cursor(this)
  this.source = new Source(this)
  this.keyboard = new Keyboard(this)
  this.history = new History()
  this.controller = new Controller()
  this.clocks = [new Clock(120)]
  this.selectedClock = 0

  // Themes
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' })

  this.el = document.createElement('canvas')
  this.context = this.el.getContext('2d')

  // Settings
  this.grid = { w: 8, h: 8 }
  this.tile = { w: 10, h: 15 }
  this.scale = window.devicePixelRatio

  this.isPaused = false

  this.install = function (host) {
    host.appendChild(this.el)
    this.theme.install(host)
  }

  this.start = function () {
    this.theme.start()
    this.io.start()
    this.source.start()
    this.history.bind(this.orca, 's')
    this.history.record(this.orca.s)
    this.nextClock()
    this.update()
    this.el.className = 'ready'
  }

  this.run = function () {
    this.io.clear()
    this.orca.run()
    this.io.run()
    this.update()
  }

  this.play = function () {
    console.log('Play')
    this.isPaused = false
    this.update()
    this.clock().setRunning(true)
  }

  this.stop = function () {
    console.log('Stop')
    this.io.midi.silence()
    this.isPaused = true
    this.update()
    this.clock().setRunning(false)
  }

  this.load = function (orca, frame = 0) {
    this.history.reset()
    this.orca = orca
    this.setSize({ w: orca.w * this.tile.w, h: orca.h * this.tile.h })
    this.update()
  }

  this.unload = function () {
    this.io.midi.silence()
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

  this.prevFrame = function () {
    this.orca.f -= 2
    this.stop()
    this.run()
  }

  this.nextFrame = function () {
    this.stop()
    this.run()
  }

  // Clock

  this.clock = function () {
    return this.clocks[this.selectedClock]
  }

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
    this.grid.w = w
    this.grid.h = h
    this.update()
  }

  this.setSize = function (size) {
    console.log(`Set Size: ${size.w}x${size.h}`)
    require('electron').remote.getCurrentWindow().setSize(parseInt(size.w + 60), parseInt(size.h + 60 + this.tile.h), false)
    this.resize()
  }

  this.toggleRetina = function () {
    this.scale = this.scale === 1 ? window.devicePixelRatio : 1
    this.resize(true)
  }

  this.togglePlay = function () {
    if (this.isPaused === true) {
      this.play()
    } else {
      this.stop()
    }
  }

  this.modSpeed = function (mod = 0) {
    if (this.clock().canSetBpm()) {
      this.setSpeed(this.clock().getBpm() + mod)
    }
  }

  this.modGrid = function (x = 0, y = 0) {
    const w = clamp(this.grid.w + x, 4, 16)
    const h = clamp(this.grid.h + y, 4, 16)
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
    this.context.clearRect(0, 0, this.el.width, this.el.height)
  }

  this.guide = function (x, y) {
    const g = this.orca.glyphAt(x, y)
    if (g !== '.') { return g }
    if (this.isCursor(x, y)) { return this.isPaused ? '~' : '@' }
    if (x % this.grid.w === 0 && y % this.grid.h === 0) { return '+' }
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
    const col = this.grid.w
    // Cursor
    this.write(`${this.cursor.x},${this.cursor.y}${this.cursor.mode === 2 ? '^' : this.cursor.mode === 1 ? '+' : ''}`, col * 0, 1, this.grid.w)
    this.write(`${this.cursor.w}:${this.cursor.h}`, col * 1, 1, this.grid.w)
    this.write(`${this.cursor.inspect()}`, col * 2, 1, this.grid.w)
    this.write(`${this.orca.f}f${this.isPaused ? '*' : ''}`, col * 3, 1, this.grid.w)
    this.write(`${this.orca.inspect(this.grid.w)}`, col * 4, 1, this.grid.w)

    // Grid
    this.write(`${this.orca.w}x${this.orca.h}`, col * 0, 0, this.grid.w)
    this.write(`${this.grid.w}/${this.grid.h}`, col * 1, 0, this.grid.w)
    this.write(`${this.source}`, col * 2, 0, this.grid.w)
    this.write(`${this.clock()}${this.orca.f % 4 === 0 ? '*' : ''}`, col * 3, 0, this.grid.w)
    this.write(`${this.io.inspect(this.grid.w)}`, col * 4, 0, this.grid.w)

    if (this.orca.f < 25) {
      this.write(`${this.io.midi}`, col * 5, 0, this.grid.w * 2)
    }
  }

  this.drawSprite = function (x, y, g, type) {
    const style = this.drawStyle(type)
    if (style.bg) {
      const bgrect = { x: x * this.tile.w * this.scale, y: (y) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
      this.context.fillStyle = style.bg
      this.context.fillRect(bgrect.x, bgrect.y, bgrect.w, bgrect.h)
    }
    if (style.fg) {
      const fgrect = { x: (x + 0.5) * this.tile.w * this.scale, y: (y + 1) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
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

  this.resize = function (force = false) {
    const size = { w: window.innerWidth - 60, h: window.innerHeight - 90 }
    const tiles = { w: Math.floor(size.w / this.tile.w), h: Math.floor(size.h / this.tile.h) }

    if (this.orca.w === tiles.w && this.orca.h === tiles.h && force === false) { return }

    // Limit Tiles to Bounds
    const bounds = this.orca.bounds()
    if (tiles.w <= bounds.w) { tiles.w = bounds.w + 1 }
    if (tiles.h <= bounds.h) { tiles.h = bounds.h + 1 }
    this.crop(tiles.w, tiles.h)

    // Keep cursor in bounds
    if (this.cursor.x >= tiles.w) { this.cursor.x = tiles.w - 1 }
    if (this.cursor.y >= tiles.h) { this.cursor.y = tiles.h - 1 }

    console.log(`Resize to: ${tiles.w}x${tiles.h}`)

    this.el.width = this.tile.w * this.orca.w * this.scale
    this.el.height = (this.tile.h + 3) * this.orca.h * this.scale
    this.el.style.width = `${parseInt(this.tile.w * this.orca.w)}px`
    this.el.style.height = `${parseInt((this.tile.h + 3) * this.orca.h)}px`

    this.context.textBaseline = 'bottom'
    this.context.textAlign = 'center'
    this.context.font = `${this.tile.h * 0.75 * this.scale}px input_mono_medium`

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

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
