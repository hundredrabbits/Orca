'use strict'

function Terminal (pico) {
  const Cursor = require('./cursor')
  const Source = require('./source')
  const Midi = require('./midi')

  this.midi = new Midi(this)
  this.cursor = new Cursor(this)
  this.source = new Source(pico, this)

  this.controller = new Controller()
  this.theme = new Theme({ background: '#111111', f_high: '#ffffff', f_med: '#777777', f_low: '#333333', f_inv: '#000000', b_high: '#ffb545', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffffff' })

  this.pico = pico
  this.el = document.createElement('canvas')
  this.isPaused = false
  this.tile = { w: 20, h: 30 }
  this.size = { width: this.tile.w * pico.w, height: this.tile.h * pico.h + (this.tile.h * 3), ratio: 0.5 }
  this.debug = 'hello.'

  this.timer = null
  this.bpm = 120

  this.install = function (host) {
    this.resize()
    host.appendChild(this.el)
    this.theme.install(host)
  }

  this.start = function () {
    this.pico.terminal = this
    this.pico.start()
    this.theme.start()
    this.midi.start()

    this.update()
    this.setSpeed(120)
  }

  this.run = function () {
    if (this.isPaused) { return }

    this.midi.clear()
    this.clear()

    this.pico.run()
    this.midi.run()
    this.update()
  }

  this.pause = function () {
    this.isPaused = !this.isPaused
    this.log(this.isPaused ? 'Paused' : 'Unpaused')
  }

  this.load = function (data) {
    const w = data.split('\n')[0].length
    const h = data.split('\n').length
    this.log(`Loading ${w}x${h}`)
    pico.load(w, h, data)
    this.resize()
    this.update()
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

  //

  this.log = function (msg) {
    this.debug = msg
  }

  this.update = function () {
    this.clear()
    this.drawProgram()
    this.drawInterface()
  }

  this.reset = function () {
    this.theme.reset()
  }

  //

  this.isCursor = function (x, y) {
    return x === this.cursor.x && y === this.cursor.y
  }

  this.isSelection = function (x, y) {
    if (x >= this.cursor.x && x < this.cursor.x + this.cursor.w && y >= this.cursor.y && y < this.cursor.y + this.cursor.h) {
      return true
    }
    return false
  }

  this.findPorts = function () {
    const h = {}
    const fns = pico.findFns()
    for (const id in fns) {
      const g = fns[id]
      if (pico.isLocked(g.x, g.y)) { continue }
      for (const id in g.ports) {
        const port = g.ports[id]
        h[`${g.x + port.x}:${g.y + port.y}`] = port.output ? 2 : port.bang ? 1 : 3
      }
    }

    return h
  }

  //

  this.context = function () {
    return this.el.getContext('2d')
  }

  this.drawProgram = function () {
    const ports = this.findPorts()
    const terminal = this

    let y = 0
    while (y < pico.h) {
      let x = 0
      while (x < pico.w) {
        const styles = {
          isSelection: terminal.isSelection(x, y),
          isCursor: terminal.isCursor(x, y),
          isPort: ports[`${x}:${y}`],
          isLocked: pico.isLocked(x, y)
        }
        this.drawSprite(x, y, pico.glyphAt(x, y), styles)
        x += 1
      }
      y += 1
    }
  }

  this.drawInterface = function () {
    const col = 6
    // Cursor
    this.write(`${this.cursor.x},${this.cursor.y}`, col * 0, 1)
    this.write(`${this.cursor.w}:${this.cursor.h}`, col * 1, 1)
    this.write(`${pico.w}x${pico.h}`, col * 2, 1)
    this.write(this.debug, col * 3, 1)

    // Grid
    this.write(`${this.cursor.inspect()}`.substr(0, col), col * 0, 0)
    this.write(`${this.cursor._mode()}`, col * 1, 0)
    this.write(`${this.bpm}`, col * 2, 0)
    this.write(this.midi.vu(), col * 3, 0)
  }

  this.write = function (text, offsetX, offsetY) {
    let x = 0
    while (x < text.length) {
      const c = text.substr(x, 1)
      this.drawSprite(offsetX + x, pico.h + offsetY, c)
      x += 1
    }
  }

  this.clear = function () {
    const ctx = this.context()
    ctx.clearRect(0, 0, this.size.width, this.size.height)
  }

  this.drawSprite = function (x, y, g, styles = { isCursor: false, isSelection: false, isPort: false }) {
    const ctx = this.context()

    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.font = `${this.tile.h * 0.75}px input_mono_medium`

    if (styles.isSelection) {
      ctx.fillStyle = this.theme.active.b_inv
      ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
      ctx.fillStyle = this.theme.active.f_inv
    } else if (styles.isPort) {
      if (styles.isPort === 1) { // Bang
        ctx.fillStyle = this.theme.active.b_med
        ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = this.theme.active.f_low
      } else if (styles.isPort === 2) { // Output
        ctx.fillStyle = this.theme.active.b_high
        ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = this.theme.active.f_low
      } else if (styles.isPort === 3) {
        ctx.fillStyle = this.theme.active.b_low
        ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = this.theme.active.f_high
      }
    } else if (styles.isLocked) {
      ctx.fillStyle = this.theme.active.background
      ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
      ctx.fillStyle = this.theme.active.f_med
    } else {
      ctx.fillStyle = 'white'
    }
    ctx.fillText(styles.isCursor && g === '.' ? (!this.isPaused ? '@' : '~') : g, (x + 0.5) * this.tile.w, (y + 1) * this.tile.h)
  }

  this.resize = function () {
    this.el.width = this.size.width
    this.el.height = this.size.height + this.tile.h
    this.el.style.width = (this.size.width * this.size.ratio) + 'px'
    this.el.style.height = (this.size.height * this.size.ratio) + 'px'

    let { remote } = require('electron')
    let win = remote.getCurrentWindow()

    const width = parseInt((this.size.width * this.size.ratio) + 60)
    const height = parseInt((this.size.height * this.size.ratio) + 30)

    win.setSize(width, height, true)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
