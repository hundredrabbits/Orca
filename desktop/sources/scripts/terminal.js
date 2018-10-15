'use strict'

function Terminal (pico) {
  this.pico = pico
  this.el = document.createElement('canvas')
  this.controller = new Controller();
  this.theme = new Theme(this.theme = new Theme({ background: '#111111', f_high: '#ffffff', f_med: '#333333', f_low: '#000000', f_inv: '#000000', b_high: '#ffb545', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffffff'}));
  this.is_paused = false
  this.tile = { w: 15, h: 20 }

  this.cursor = {
    x: 0,
    y: 0,
    move: function (x, y) {
      this.x = clamp(this.x + x, 0, pico.w - 1)
      this.y = clamp(this.y - y, 0, pico.h - 1)
      terminal.update()
    },
    insert: function (g) {
      pico.add(this.x, this.y, g)
    },
    erase: function (g) {
      pico.remove(this.x, this.y)
    },
    inspect: function () {
      const g = pico.glyphAt(this.x, this.y)
      return pico.docs[g] ? pico.docs[g] : '>'
    }
  }

  this.install = function (host) {
    this.size = { width: this.tile.w * pico.w, height: this.tile.h * pico.h, ratio: 0.75 }
    this.el.width = this.size.width
    this.el.height = this.size.height + this.tile.h
    this.el.style.width = (this.size.width * this.size.ratio) + 'px'
    this.el.style.height = (this.size.height * this.size.ratio) + 'px'

    host.appendChild(this.el)
  }

  this.start = function()
  {
    this.pico.terminal = this
    this.pico.start()

    this.update()
    setInterval(() => { this.run() }, 200)
  }

  this.run = function () {
    if (this.is_paused) { return }

    this.pico.run()
    this.update()
  }

  this.pause = function () {
    this.is_paused = !this.is_paused
    this.log(this.is_paused ? "Paused" : "Unpaused")
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
      terminal._grid.width = w
      terminal.update()
    })
  }

  this.log = function (msg) {
    console.log(msg)
    this.update()
  }

  this.update = function () {
    this.clear()
    this.draw_program()
    this.draw_output()
  }

  this.draw_program = function () {
    const ports = this.find_ports()
    const terminal = this

    let y = 0
    while (y < pico.h) {
      let x = 0
      while (x < pico.w) {
        const styles = {
          is_cursor: terminal.is_cursor(x, y),
          is_port: ports[`${x}:${y}`]
        }
        this.draw_sprite(x, y, pico.glyphAt(x, y), styles)
        x += 1
      }
      y += 1
    }
  }

  this.draw_output = function () {
    const s = pico.r.replace(/\./g, ' ').trim()

    let x = 0
    while (x < s.length) {
      const c = s.substr(x, 1)
      this.draw_sprite(x, pico.size.v - 1, c)
      x += 1
    }
  }

  this.is_cursor = function (x, y) {
    return this.cursor.x == x && this.cursor.y == y
  }

  this.find_ports = function () {
    const h = {}

    // for (const id in pico.program.progs) {
    //   const g = pico.program.progs[id]
    //   if (pico.program.is_locked(g.x, g.y)) { continue }
    //   for (const id in g.ports) {
    //     const port = g.ports[id]
    //     h[`${g.x + port.x}:${g.y + port.y}`] = port.output ? 2 : port.bang ? 1 : 3
    //   }
    // }

    return h
  }

  this.context = function () {
    return this.el.getContext('2d')
  }

  this.clear = function () {
    const ctx = this.context()

    ctx.clearRect(0, 0, this.size.width, this.size.height)
  }

  this.draw_sprite = function (x, y, g, styles = { is_cursor: false, is_port: false }) {
    const ctx = this.context()

    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.font = `${this.tile.h * 0.75}px input_mono_regular`

    if (styles.is_cursor) {
      ctx.fillStyle = "#f00"
      ctx.fillRect((x + 0.5) * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
      ctx.fillStyle = "#fff"
    } else if (styles.is_port) {
      if (styles.is_port == 2) {
        ctx.fillStyle = "#0ff"
        ctx.fillRect((x + 0.5) * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = "#0ff"
      } else if (styles.is_port == 1) {
        ctx.fillStyle = "#0ff"
        ctx.fillRect((x + 0.5) * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = "#0ff"
      } else if (styles.is_port == 3) {
        ctx.fillStyle = "#0ff"
        ctx.fillRect((x + 0.5) * this.tile.w, (y) * this.tile.h, this.tile.w, this.tile.h)
        ctx.fillStyle = "#0ff"
      }
    } else {
      ctx.fillStyle = 'white'
    }
    ctx.fillText(styles.is_cursor && g == '.' ? (!pico.is_paused ? '@' : '~') : g.toUpperCase(), (x + 1) * this.tile.w, (y + 1) * this.tile.h)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
