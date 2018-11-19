'use strict'

const blessed = require('blessed')

function Terminal (pico) {
  this.pico = pico

  this._screen = blessed.screen()
  this._grid = blessed.box({ top: 1, left: 2, height: '100%-3', width: pico.w, keys: true, mouse: true, style: { fg: '#efefef' } })
  this._output = blessed.box({ bottom: 4, left: 2, height: 1, width: '100%-2', style: { fg: '#fff' } })
  this._inspector = blessed.box({ bottom: 2, left: 2, height: 1, width: '100%-4', style: { fg: '#efefef' } })
  this._log = blessed.box({ bottom: 3, left: 2, height: 1, width: '100%-4', style: { fg: '#efefef' } })

  this.isPaused = false

  this.cursor = {
    x: 0,
    y: 0,
    move: function (x, y) {
      this.x = clamp(this.x + x, 0, pico.w - 1)
      this.y = clamp(this.y - y, 0, pico.h - 1)
    },
    insert: function (g) {
      pico.add(this.x, this.y, g)
    },
    erase: function (g) {
      pico.remove(this.x, this.y)
    },
    inspect: function () {
      const g = pico.glyphAt(this.x, this.y)
      return '>'
    }
  }

  this.install = function () {
    this._screen.append(this._grid)
    this._screen.append(this._output)
    this._screen.append(this._inspector)
    this._screen.append(this._log)
  }

  this.start = function (path) {
    this.pico.start()
    this._screen.key(['escape', 'C-c'], (ch, key) => (process.exit(0)))
    this._screen.key(['up'], (ch, key) => { this.cursor.move(0, 1); this.update() })
    this._screen.key(['down'], (ch, key) => { this.cursor.move(0, -1); this.update() })
    this._screen.key(['right'], (ch, key) => { this.cursor.move(1, 0); this.update() })
    this._screen.key(['left'], (ch, key) => { this.cursor.move(-1, 0); this.update() })
    this._screen.key(['space'], (ch, key) => { this.pause(); })
    this._screen.key(['backspace'], (ch, key) => { this.cursor.erase(); })

    this._screen.on('keypress', (ch) => {
      if (!ch || ch.length !== 1) { return }
      this.cursor.insert(ch)
      if(ch === "|"){
        this.cursor.move(0,-1)        
      }
      else if(ch === ch.toUpperCase()){
        this.cursor.move(1,0)        
      }
    })

    if (path) {
      this.load(path)
    }

    this.update()
    setInterval(() => { this.run() }, 200)
  }

  this.run = function () {
    if (this.isPaused) { return }

    this.pico.run()
    this.update()
  }

  this.pause = function () {
    this.isPaused = !this.isPaused
    this.log(this.isPaused ? "Paused" : "Unpaused")
  }

  this.load = function (data) {
    const w = data.split('\n')[0].length
    const h = data.split('\n').length
    terminal.log(`Loaded: ${path} ${w}x${h}`)
    pico.load(w, h, data)
    terminal._grid.width = w
    terminal.update()
  }

  this.log = function (msg) {
    this._log.setContent(msg)
    this.update()
  }

  this.add_cursor = function (s) {
    const under = this.pico.glyphAt(this.cursor.x,this.cursor.y)
    if(under !== "."){ return s }
    const index = this.pico.indexAt(this.cursor.x, this.cursor.y)
    return s.substr(0, index) + '@' + s.substr(index + 1)
  }

  this.update = function (sight) {
    this._grid.setContent(`${this.add_cursor(this.pico.s)}`)
    this._inspector.setContent(`${this.cursor.inspect()}`)
    this._screen.render()
  }

  // Events

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
