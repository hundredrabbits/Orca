'use strict'

function Terminal () {
  const Orca = require('../../core/orca')
  const IO = require('../../core/io')
  const Cursor = require('./cursor')
  const Source = require('./source')
  const History = require('./history')
  const Commander = require('./commander')
  const Clock = require('./clock')
  const Theme = require('./lib/theme')
  const Controller = require('./lib/controller')

  this.version = 100
  this.library = require('../../core/library')

  this.orca = new Orca()
  this.io = new IO(this)
  this.cursor = new Cursor(this)
  this.source = new Source(this)
  this.commander = new Commander(this)
  this.clock = new Clock(this)
  this.history = new History()
  this.controller = new Controller()

  // Themes
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' })

  this.el = document.createElement('canvas')
  this.context = this.el.getContext('2d')

  // Settings
  this.grid = { w: 8, h: 8 }
  this.tile = {
    w: +localStorage.getItem('tilew') || 10,
    h: +localStorage.getItem('tileh') || 15
  }
  this.scale = window.devicePixelRatio
  this.hardmode = true

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
    this.clock.start()
    this.update()
    this.el.className = 'ready'
  }

  this.run = function () {
    this.io.clear()
    this.orca.run()
    this.io.run()
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

  this.setGrid = function (w, h) {
    this.grid.w = w
    this.grid.h = h
    this.update()
  }

  this.setSize = function (size) {
    const win = require('electron').remote.getCurrentWindow()
    const winSize = win.getSize()
    const targetSize = [parseInt(size.w + 60), parseInt(size.h + 60 + this.tile.h)]

    if (winSize[0] === targetSize[0] && winSize[1] === targetSize[1]) { return }

    console.log(`Window Size: ${targetSize[0]}x${targetSize[1]}, from ${winSize[0]}x${winSize[1]}`)

    win.setSize(targetSize[0], targetSize[1], false)
    this.resize()
  }

  this.updateSize = function () {
    console.log('Terminal', 'Update size')
    this.setSize({ w: this.orca.w * this.tile.w, h: this.orca.h * this.tile.h })
  }

  this.toggleRetina = function () {
    this.scale = this.scale === 1 ? window.devicePixelRatio : 1
    console.log('Terminal', `Pixel resolution: ${this.scale}`)
    this.resize(true)
  }

  this.toggleHardmode = function () {
    this.hardmode = this.hardmode !== true
    console.log('Terminal', `Hardmode: ${this.hardmode}`)
    this.update()
  }

  this.modGrid = function (x = 0, y = 0) {
    const w = clamp(this.grid.w + x, 4, 16)
    const h = clamp(this.grid.h + y, 4, 16)
    this.setGrid(w, h)
  }

  this.modZoom = function (mod = 0, reset = false) {
    this.tile = {
      w: reset ? 10 : this.tile.w * (mod + 1),
      h: reset ? 15 : this.tile.h * (mod + 1)
    }
    localStorage.setItem('tilew', this.tile.w)
    localStorage.setItem('tileh', this.tile.h)
    this.resize(true)
  }

  //

  this.isCursor = function (x, y) {
    return x === this.cursor.x && y === this.cursor.y
  }

  this.isSelection = function (x, y) {
    return !!(x >= this.cursor.x && x < this.cursor.x + this.cursor.w && y >= this.cursor.y && y < this.cursor.y + this.cursor.h)
  }

  this.isMarker = function (x, y) {
    return x % this.grid.w === 0 && y % this.grid.h === 0
  }

  this.isNear = function (x, y) {
    return x > (parseInt(this.cursor.x / this.grid.w) * this.grid.w) - 1 && x <= ((1 + parseInt(this.cursor.x / this.grid.w)) * this.grid.w) && y > (parseInt(this.cursor.y / this.grid.h) * this.grid.h) - 1 && y <= ((1 + parseInt(this.cursor.y / this.grid.h)) * this.grid.h)
  }

  this.isAligned = function (x, y) {
    return x === this.cursor.x || y === this.cursor.y
  }

  this.isEdge = function (x, y) {
    return x === 0 || y === 0 || x === this.orca.w - 1 || y === this.orca.h - 1
  }

  this.isLocals = function (x, y) {
    return this.isNear(x, y) === true && (x % (this.grid.w / 4) === 0 && y % (this.grid.h / 4) === 0) === true
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

  // Interface

  this.makeGlyph = function (x, y) {
    const g = this.orca.glyphAt(x, y)
    if (g !== '.') { return g }
    if (this.isCursor(x, y)) { return this.isPaused ? '~' : '@' }
    if (this.isMarker(x, y)) { return '+' }
    return g
  }

  this.makeStyle = function (x, y, glyph, selection) {
    const isLocked = this.orca.lockAt(x, y)
    const port = this.ports[this.orca.indexAt(x, y)]
    if (this.isSelection(x, y)) { return 4 }
    if (!port && glyph === '.' && isLocked === false && this.hardmode === true) { return this.isLocals(x, y) === true ? 9 : 7 }
    if (selection === glyph && isLocked === false && selection !== '.') { return 6 }
    if (port) { return port[2] }
    if (isLocked === true) { return 5 }
    return 9
  }

  this.makeTheme = function (type) {
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
    // LikeCursor
    if (type === 6) { return { fg: this.theme.active.b_inv } }
    // Invisible
    if (type === 7) { return {} }
    // Default
    return { fg: this.theme.active.f_low }
  }

  // Canvas

  this.clear = function () {
    this.context.clearRect(0, 0, this.el.width, this.el.height)
  }

  this.drawProgram = function () {
    const selection = this.cursor.read()
    for (let y = 0; y < this.orca.h; y++) {
      for (let x = 0; x < this.orca.w; x++) {
        const glyph = this.makeGlyph(x, y)
        const style = this.makeStyle(x, y, glyph, selection)
        this.drawSprite(x, y, glyph, style)
      }
    }
  }

  this.drawInterface = function () {
    const col = this.grid.w
    // Cursor
    this.write(`${this.cursor.x},${this.cursor.y}${this.cursor.mode === 1 ? '+' : ''}`, col * 0, 1, this.grid.w, this.cursor.mode === 1 ? 1 : 2)
    this.write(`${this.cursor.w}:${this.cursor.h}`, col * 1, 1, this.grid.w)
    this.write(`${this.cursor.inspect()}`, col * 2, 1, this.grid.w)
    this.write(`${this.orca.f}f${this.isPaused ? '*' : ''}`, col * 3, 1, this.grid.w)
    this.write(`${this.orca.inspect(this.grid.w)}`, col * 4, 1, this.grid.w)
    // Grid
    this.write(`${this.orca.w}x${this.orca.h}`, col * 0, 0, this.grid.w)
    this.write(`${this.grid.w}/${this.grid.h}`, col * 1, 0, this.grid.w)
    this.write(`${this.source}`, col * 2, 0, this.grid.w)
    this.write(`${this.clock}`, col * 3, 0, this.grid.w, this.io.midi.inputIndex > -1 ? 1 : 2)
    this.write(`${this.io.inspect(this.grid.w)}`, col * 4, 0, this.grid.w)

    if (this.orca.f < 20) {
      this.write(`${this.io.midi}`, col * 5, 0, this.grid.w * 2)
    }

    if (this.commander.isActive === true) {
      this.write(`${this.commander.query}${this.orca.f % 2 === 0 ? '_' : ''}`, col * 5, 1, this.grid.w * 2, 1)
    } else if (this.orca.f < 19) {
      this.write(`v${this.version}`, col * 5, 1, this.grid.w * 2, 3)
    }
  }

  this.drawSprite = function (x, y, g, type) {
    const theme = this.makeTheme(type)
    if (theme.bg) {
      const bgrect = { x: x * this.tile.w * this.scale, y: (y) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
      this.context.fillStyle = theme.bg
      this.context.fillRect(bgrect.x, bgrect.y, bgrect.w, bgrect.h)
    }
    if (theme.fg) {
      const fgrect = { x: (x + 0.5) * this.tile.w * this.scale, y: (y + 1) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
      this.context.fillStyle = theme.fg
      this.context.fillText(g, fgrect.x, fgrect.y)
    }
  }

  this.write = function (text, offsetX, offsetY, limit, type = 2) {
    let x = 0
    while (x < text.length && x < limit - 1) {
      this.drawSprite(offsetX + x, this.orca.h + offsetY, text.substr(x, 1), type)
      x += 1
    }
  }

  // Resize tools

  this.resize = function (force = false) {
    const size = { w: window.innerWidth - 60, h: window.innerHeight - (60 + this.tile.h * 2) }
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

    console.log(`Resized to: ${tiles.w}x${tiles.h}`)

    this.el.width = this.tile.w * this.orca.w * this.scale
    this.el.height = (this.tile.h + (this.tile.h / 5)) * this.orca.h * this.scale
    this.el.style.width = `${parseInt(this.tile.w * this.orca.w)}px`
    this.el.style.height = `${parseInt((this.tile.h + (this.tile.h / 5)) * this.orca.h)}px`

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

  // Events

  window.addEventListener('dragover', (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  })

  window.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    const path = file.path ? file.path : file.name

    if (!path || path.indexOf('.orca') < 0) { console.log('Orca', 'Not a orca file'); return }

    terminal.source.read(path)
  })

  window.onresize = (event) => {
    terminal.resize()
  }

  // Helpers

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
