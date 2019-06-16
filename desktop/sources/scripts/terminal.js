'use strict'

import Orca from '../../core/orca.js'
import IO from '../../core/io.js'
import Cursor from './cursor.js'
import Source from './source.js'
import History from './history.js'
import Commander from './commander.js'
import Clock from './clock.js'
import Theme from './lib/theme.js'
import Controller from './lib/controller.js'
import library from '../../core/library.js'

export default function Terminal () {
  this.version = 141
  this.library = library

  this.orca = new Orca(this)
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
  this.guide = false

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

    this.toggleGuide(this.reqGuide() === true)
  }

  this.run = function () {
    this.io.clear()
    this.clock.run()
    this.source.run()
    this.orca.run()
    this.io.run()
    this.update()
  }

  this.update = function () {
    if (document.hidden === true) { return }
    this.clear()
    this.ports = this.findPorts()
    this.drawProgram()
    this.drawInterface()
    this.drawGuide()
  }

  this.reset = function () {
    this.theme.reset()
  }

  this.setGrid = function (w, h) {
    this.grid.w = w
    this.grid.h = h
    this.update()
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

  this.toggleGuide = function (force = null) {
    const display = force !== null ? force : this.guide !== true
    if (display === this.guide) { return }
    console.log('Terminal', `Toggle Guide: ${display}`)
    this.guide = display
    this.update()
  }

  this.reqGuide = function () {
    const session = this.source.recall('session')
    console.log('Terminal', 'Session #' + session)
    if (!session || parseInt(session) < 20) { return true }
    return false
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
    if (glyph === '*' && isLocked === false) { return 6 }
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
    // Reader
    if (type === 6) { return { fg: this.theme.active.b_inv } }
    // Invisible
    if (type === 7) { return {} }
    // Reader
    if (type === 8) { return { bg: this.theme.active.b_low, fg: this.theme.active.f_high } }
    // Reader+Background
    if (type === 10) { return { bg: this.theme.active.background, fg: this.theme.active.f_high } }
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
    const variables = Object.keys(this.orca.variables).join('')
    const col1 = this.orca.h
    const col2 = this.orca.h + 1

    if (this.commander.isActive === true) {
      this.write(`${this.commander.query}${this.orca.f % 2 === 0 ? '_' : ''}`, col * 0, this.orca.h + 1, this.grid.w * 2)
    } else {
      this.write(`${this.cursor.x},${this.cursor.y}${this.cursor.mode === 1 ? '+' : ''}`, col * 0, this.orca.h + 1, this.grid.w, this.cursor.mode === 1 ? 1 : 2)
      this.write(`${this.cursor.w}:${this.cursor.h}`, col * 1, this.orca.h + 1, this.grid.w)
      this.write(`${this.cursor.inspect()}`, col * 2, this.orca.h + 1, this.grid.w)
      this.write(`${this.orca.f}f${this.isPaused ? '*' : ''}`, col * 3, this.orca.h + 1, this.grid.w)
    }

    this.write(`${this.orca.w}x${this.orca.h}`, col * 0, this.orca.h, this.grid.w)
    this.write(`${this.grid.w}/${this.grid.h}${this.tile.w !== 10 ? ' ' + (this.tile.w / 10).toFixed(1) : ''}`, col * 1, this.orca.h, this.grid.w)
    this.write(`${this.source}`, col * 2, this.orca.h, this.grid.w, this.source.queue.length > terminal.orca.f ? 3 : 2)
    this.write(`${this.clock}`, col * 3, this.orca.h, this.grid.w, this.io.midi.inputIndex > -1 ? 3 : 2)

    if (this.orca.f < 15) {
      this.write(`${this.io.midi}`, col * 4, this.orca.h, this.grid.w * 2)
      this.write(`Version ${this.version}`, col * 4, this.orca.h + 1, this.grid.w * 2)
    } else {
      this.write(`${this.io.inspect(this.grid.w)}`, col * 4, this.orca.h, this.grid.w)
      this.write(`${display(variables, this.orca.f, this.grid.w)}`, col * 4, this.orca.h + 1, this.grid.w)
    }
  }

  this.drawGuide = function () {
    if (this.guide !== true) { return }
    const operators = Object.keys(this.library).filter((val) => { return isNaN(val) })
    for (const id in operators) {
      const key = operators[id]
      const oper = new this.library[key]()
      const text = oper.info
      const frame = this.orca.h - 4
      const x = (Math.floor(parseInt(id) / frame) * 32) + 2
      const y = (parseInt(id) % frame) + 2
      this.write(key, x, y, 99, 3)
      this.write(text, x + 2, y, 99, 10)
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

  this.write = function (text, offsetX, offsetY, limit = 50, type = 2) {
    let x = 0
    while (x < text.length && x < limit - 1) {
      this.drawSprite(offsetX + x, offsetY, text.substr(x, 1), type)
      x += 1
    }
  }

  // Resize tools

  this.fit = function () {
    const size = { w: (this.orca.w * this.tile.w) + 60, h: (this.orca.h * this.tile.h) + 60 + (2 * this.tile.h) }
    const win = require('electron').remote.getCurrentWindow()
    const winSize = win.getSize()
    const current = { w: winSize[0], h: winSize[1] }
    if (current.w === size.w && current.h === size.h) { console.warn('Terminal', 'No resize required.'); return }
    console.log('Source', `Fit terminal for ${this.orca.w}x${this.orca.h}(${size.w}x${size.h})`)
    win.setSize(parseInt(size.w), parseInt(size.h), false)
    this.resize()
  }

  this.resize = function (force = false) {
    const size = { w: window.innerWidth - 60, h: window.innerHeight - (60 + this.tile.h * 2) }
    const tiles = { w: Math.ceil(size.w / this.tile.w), h: Math.ceil(size.h / this.tile.h) }

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
    this.el.style.width = `${Math.ceil(this.tile.w * this.orca.w)}px`
    this.el.style.height = `${Math.ceil((this.tile.h + (this.tile.h / 5)) * this.orca.h)}px`

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

  // Docs

  this.docs = function () {
    let html = ''
    const operators = Object.keys(library).filter((val) => { return isNaN(val) })
    for (const id in operators) {
      const oper = new this.library[operators[id]]()
      const ports = oper.ports.input ? Object.keys(oper.ports.input).reduce((acc, key, val) => { return acc + ' ' + key }, '') : ''
      html += `- \`${oper.glyph.toUpperCase()}\` **${oper.name}**${ports !== '' ? '(' + ports.trim() + ')' : ''}: ${oper.info}.\n`
    }
    return html
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

  function display (str, f, max) { return str.length < max ? str : str.slice(f % str.length) + str.substr(0, f % str.length) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
