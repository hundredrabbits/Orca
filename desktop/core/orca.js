'use strict'

const library = require('./library')

function Orca (terminal, host = null) {
  this.w = 0 // Default Width
  this.h = 0 // Default Height
  this.s = '' // String
  this.f = host ? host.f : 0 // Frame

  this.host = host

  this.terminal = terminal
  this.keys = Object.keys(library).slice(0, 36)

  this.locks = []
  this.values = {}
  this.runtime = []

  this.run = function () {
    this.runtime = this.parse()
    this.operate(this.runtime)
    this.f += 1
  }

  this.reset = function (w = this.w, h = this.h) {
    this.w = w
    this.h = h
    this.s = new Array((this.h * this.w) + 1).join('.')
  }

  this.load = function (w, h, s, f = 0) {
    this.w = w
    this.h = h
    this.f = f
    this.s = this.clean(s)
    return this
  }

  this.write = function (x, y, g) {
    if (!g) { return }
    if (g.length !== 1) { return }
    if (!this.inBounds(x, y)) { return }
    if (!this.isAllowed(g)) { return }
    if (this.glyphAt(x, y) === g) { return }
    const index = this.indexAt(x, y)
    this.s = this.s.substr(0, index) + g + this.s.substr(index + g.length)
  }

  this.clean = function (str) {
    let s = `${str}`
    s = s.replace(/\n/g, '').trim()
    s = s.substr(0, this.w * this.h)
    return s
  }

  // Operators

  this.parse = function () {
    const a = []
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const g = this.glyphAt(x, y)
        const operator = this.cast(g, x, y)
        if (operator) {
          a.push(operator)
        }
      }
    }
    return a
  }

  this.cast = function (g, x, y) {
    if (g === '.') { return }
    if (!library[g.toLowerCase()]) { return }
    const passive = g === g.toUpperCase() && this.valueOf(g) > 9
    return new library[g.toLowerCase()](this, x, y, passive)
  }

  this.operate = function (operators) {
    this.release()
    for (const id in operators) {
      const operator = operators[id]
      if (this.lockAt(operator.x, operator.y)) { continue }
      if (operator.passive || operator.bang()) {
        operator.haste()
        operator.permissions()
      }
    }
    for (const id in operators) {
      const operator = operators[id]
      if (this.lockAt(operator.x, operator.y)) { continue }
      if (operator.passive || operator.bang()) {
        operator.run()
      }
    }
  }

  this.bounds = function () {
    let w = 0
    let h = 0
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const g = this.glyphAt(x, y)
        if (g !== '.') {
          if (x > w) { w = x }
          if (y > h) { h = y }
        }
      }
    }
    return { w: w, h: h }
  }

  // Locks

  this.release = function () {
    this.locks = new Array(this.w * this.h)
    this.values = {}
  }

  this.unlock = function (x, y) {
    this.locks[this.indexAt(x, y)] = null
  }

  this.lock = function (x, y) {
    if (this.lockAt(x, y)) { return }
    this.locks[this.indexAt(x, y)] = true
  }

  // Helpers

  this.inBounds = function (x, y) {
    return x >= 0 && x < this.w && y >= 0 && y < this.h
  }

  this.isAllowed = function (g) {
    return g === '.' || !!library[`${g}`.toLowerCase()]
  }

  this.keyOf = function (val) {
    return this.keys[val % 36]
  }

  this.valueOf = function (g) {
    return clamp(this.keys.indexOf(`${g}`.toLowerCase()), 0, 35)
  }

  this.indexAt = function (x, y) {
    return x + (this.w * y)
  }

  this.posAt = function (index) {
    return { x: index % this.w, y: parseInt(index / this.w) }
  }

  this.glyphAt = function (x, y, req = null) {
    return this.s.charAt(this.indexAt(x, y))
  }

  this.lockAt = function (x, y) {
    return this.locks[this.indexAt(x, y)] === true
  }

  // Tools

  this.format = function () {
    const a = []
    for (let y = 0; y < this.h; y++) {
      a.push(this.s.substr(y * this.w, this.w))
    }
    return a.reduce((acc, val) => {
      return `${acc}${val}\n`
    }, '')
  }

  this.toString = function () {
    return this.format().trim()
  }

  this.reset()

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Orca
