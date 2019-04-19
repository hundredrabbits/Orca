'use strict'

function Terminal () {
  const Orca = require('../../core/orca')
  const IO = require('../../core/io')
  const Cursor = require('./cursor')
  const Renderer = require('./renderer')
  const Source = require('./source')
  const History = require('./history')
  const Commander = require('./commander')
  const Clock = require('./clock')
  const Theme = require('./lib/theme')
  const Controller = require('./lib/controller')

  this.library = require('../../core/library')

  this.orca = new Orca()
  this.io = new IO(this)
  this.cursor = new Cursor(this)
  this.source = new Source(this)
  this.commander = new Commander(this)
  this.clock = new Clock(this)
  this.renderer = new Renderer(this)
  this.history = new History()
  this.controller = new Controller()

  // Themes
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' })

  // Settings
  this.grid = { w: 8, h: 8 }
  this.tile = { w: 10, h: 15 }
  this.scale = window.devicePixelRatio

  this.install = function (host) {
    this.theme.install(host)
    this.renderer.install(host)
  }

  this.start = function () {
    this.theme.start()
    this.io.start()
    this.source.start()
    this.history.bind(this.orca, 's')
    this.history.record(this.orca.s)
    this.clock.start()
    this.renderer.start()
    this.update()
  }

  this.run = function () {
    this.io.clear()
    this.orca.run()
    this.io.run()
    this.update()
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
    this.ports = this.findPorts()
    this.renderer.update()
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
    console.log(`Set Size: ${size.w}x${size.h}`)
    require('electron').remote.getCurrentWindow().setSize(parseInt(size.w + 60), parseInt(size.h + 60 + this.tile.h), false)
    this.renderer.resize()
  }

  this.toggleRetina = function () {
    this.scale = this.scale === 1 ? window.devicePixelRatio : 1
    console.log('Terminal', `Pixel resolution: ${this.scale}`)
    this.renderer.resize(true)
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

  // Resize tools

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
    terminal.renderer.resize()
  }

  // Helpers

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
