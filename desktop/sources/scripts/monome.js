'use strict'

export default function Monome (terminal) {
  const serialosc = require('serialosc')
  this.device = null
  this.mode = 0
  this.size = { w: 16, h: 8 }

  this.start = function () {
    serialosc.start()
    serialosc.on('device:add', (device) => { this.add(device) })
  }

  this.add = function (device) {
    console.log('Monome', 'Model: ' + device.model)
    this.device = device
    this.device.on('key', (data) => { this.onKey(data) })
    this.device.all(0)
  }

  this.onKey = function (data) {
    if (data.s === 1) {
      this.onKeyDown(data)
    } else {
      this.onKeyUp(data)
    }
  }

  this.onKeyDown = function (data) {
    this.device.set(data)
  }

  this.onKeyUp = function (data) {
    terminal.cursor.moveTo(data.x, data.y)
    this.device.set(data)
    this.toggleMode()
  }

  this.toggleMode = function () {
    this.mode = this.mode === 1 ? 0 : 1
    this.update()
  }

  this.update = function () {
    console.log('mode', this.mode)
    if (this.mode == 0) {
      this.viewKeyboard()
    } else {
      this.viewGrid()
    }
  }

  this.viewKey = function (x, y) {
    const template = { size: {w:10,h:4}, offset: {x:3,y:2}}
    if(x >= template.offset.x && x < template.offset.x+template.size.w && y >= template.offset.y && y < template.offset.y+template.size.h ){
      return 1
    }
    return 0
  }

  this.viewKeyboard = function () {
    const m = makeEmpty(this.size.x, this.size.y)
    for (let x = 0; x < this.size.w; x++) {
      for (let y = 0; y < this.size.h; y++) {
        m[x][y] = this.viewKey(x, y)
      }
    }
    this.redraw(m)
  }

  this.viewGrid = function () {
    const m = makeEmpty(this.size.x, this.size.y)

    for (let x = 0; x < this.size.w; x++) {
      for (let y = 0; y < this.size.h; y++) {
        m[x][y] = 0
      }
    }

    this.redraw(m)
  }

  this.redraw = function (m) {
    const left = []
    const right = []
    for (let y = 0; y < this.size.h; y++) {
      left[y] = []
      for (let x = 0; x < 8; x++) {
        left[y].push(m[x][y])
      }
    }
    for (let y = 0; y < this.size.h; y++) {
      right[y] = []
      for (let x = 8; x < 16; x++) {
        right[y].push(m[x][y])
      }
    }
    this.device.map(0, 0, left)
    this.device.map(8, 0, right)
  }

  function makeEmpty (w = 16, h = 8) {
    const m = []
    for (let x = 0; x < w; x++) {
      m.push([])
      for (let y = 0; y < h; y++) {
        m[x].push(0)
      }
    }
    return m
  }
}
