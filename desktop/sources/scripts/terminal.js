'use strict'

function Terminal (pico) {
  const Cursor = require('./cursor')

  this.cursor = new Cursor(this)
  this.controller = new Controller()
  this.theme = new Theme(this.theme = new Theme({ background: '#111111', f_high: '#ffffff', f_med: '#333333', f_low: '#000000', f_inv: '#000000', b_high: '#ffb545', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffffff' }))

  this.pico = pico
  this.el = document.createElement('canvas')
  this.is_paused = false
  this.tile = { w: 12, h: 20 }
  this.debug = 'hello.'
  this.timer = null

  this.install = function (host) {
    this.resize()
    host.appendChild(this.el)
    this.theme.install(host)
  }

  this.resize = function () {
    this.size = { width: this.tile.w * pico.w, height: this.tile.h * pico.h + (this.tile.h * 3), ratio: 0.75 }
    this.el.width = this.size.width
    this.el.height = this.size.height + this.tile.h
    this.el.style.width = (this.size.width * this.size.ratio) + 'px'
    this.el.style.height = (this.size.height * this.size.ratio) + 'px'

    let { remote } = require('electron')
    let win = remote.getCurrentWindow()

    win.setSize((this.size.width * this.size.ratio) + 60, (this.size.height * this.size.ratio) + 30, true)
  }

  this.start = function () {
    this.theme.start()
    this.pico.terminal = this
    this.pico.start()
    this.log('Started.')

    this.update()
    this.setSpeed(120)
  }

  this.setSpeed = function (bpm) {
    this.log(`Changed speed to ${bpm}.`)
    const ms = (60000 / bpm) / 4
    clearInterval(this.timer)
    this.timer = setInterval(() => { this.run() }, ms)
  }

  this.run = function () {
    if (this.is_paused) { return }

    this.pico.run()
    this.update()
  }

  this.pause = function () {
    this.is_paused = !this.is_paused
    this.log(this.is_paused ? 'Paused' : 'Unpaused')
  }

  this.load = function (path) {
    const terminal = this
    var fs = require('fs')
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) throw err
      const w = data.split('\n')[0].length
      const h = data.split('\n').length
      terminal.log(`Loaded: ${path} ${w}x${h}`)
      pico.load(w, h, data)
      terminal.resize()
      terminal.update()
    })
  }

  this.log = function (msg) {
    this.debug = msg
    this.update()
  }

  this.update = function () {
    this.clear()
    this.draw_program()
    this.draw_output(2)
    this.draw_debug(1)
    this.draw_inspector(0)
  }

  this.draw_program = function () {
    const ports = this.find_ports()
    const terminal = this

    let y = 0
    while (y < pico.h) {
      let x = 0
      while (x < pico.w) {
        const styles = {
          isSelection: terminal.isSelection(x, y),
          isCursor: terminal.isCursor(x, y),
          is_port: ports[`${x}:${y}`]
        }
        this.draw_sprite(x, y, pico.glyphAt(x, y), styles)
        x += 1
      }
      y += 1
    }
  }

  this.draw_output = function (offset) {
    const s = pico.r.replace(/\./g, ' ').trim()

    let x = 0
    while (x < s.length) {
      const c = s.substr(x, 1)
      this.draw_sprite(x, pico.h + offset, c)
      x += 1
    }
  }

  this.draw_debug = function (offset) {
    const s = this.debug.trim()
    let x = 0
    while (x < s.length) {
      const c = s.substr(x, 1)
      this.draw_sprite(x, pico.h + offset, c)
      x += 1
    }
  }

  this.draw_inspector = function (offset) {
    const s = this.cursor.inspect()
    let x = 0
    while (x < s.length) {
      const c = s.substr(x, 1)
      this.draw_sprite(x, pico.h + offset, c)
      x += 1
    }
  }

  this.isCursor = function (x, y) {
    return x === this.cursor.x && y === this.cursor.y
  }

  this.isSelection = function (x, y) {
    if (x >= this.cursor.x && x < this.cursor.x + this.cursor.w && y >= this.cursor.y && y < this.cursor.y + this.cursor.h) {
      return true
    }
    return false
  }

  this.find_ports = function () {
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

  this.context = function () {
    return this.el.getContext('2d')
  }

  this.clear = function () {
    const ctx = this.context()
    ctx.clearRect(0, 0, this.size.width, this.size.height)
  }

  this.draw_sprite = function (x, y, g, styles = { isCursor: false, isSelection: false, is_port: false }) {
    const ctx = this.context()

    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.font = `${this.tile.h * 0.75}px input_mono_regular`

    if (styles.isSelection) {
      ctx.fillStyle = this.theme.active.b_inv
      ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
      ctx.fillStyle = this.theme.active.f_inv
    } else if (styles.is_port) {
      if (styles.is_port == 2) {
        ctx.fillStyle = this.theme.active.b_high
        ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = this.theme.active.f_low
      } else if (styles.is_port == 1) {
        ctx.fillStyle = this.theme.active.b_med
        ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = this.theme.active.f_low
      } else if (styles.is_port == 3) {
        ctx.fillStyle = this.theme.active.b_low
        ctx.fillRect(x * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = this.theme.active.f_high
      }
    } else {
      ctx.fillStyle = 'white'
    }
    ctx.fillText(styles.isCursor && g == '.' ? (!pico.is_paused ? '@' : '~') : g.toUpperCase(), (x + 0.5) * this.tile.w, (y + 1) * this.tile.h)
  }
}

module.exports = Terminal
