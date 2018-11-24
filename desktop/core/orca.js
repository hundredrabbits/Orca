'use strict'

function Orca (library = {}) {
  this.w = 57 // Default Width
  this.h = 25 // Default Height
  this.s = '' // String
  this.f = 0 // Frame

  this.keys = Object.keys(library)
  this.locks = []
  this.ports = {}
  this.runtime = []

  this.run = function () {
    this.runtime = this.parse()
    this.operate(this.runtime)
    this.f += 1
  }

  this.reset = function () {
    this.s = new Array((this.h * this.w) + 1).join('.')
  }

  this.load = function (w, h, s) {
    this.w = w
    this.h = h
    this.f = 0
    this.s = this.clean(s)
  }

  this.write = function (x, y, ch) {
    if (ch.length !== 1) { return }
    if (!this.inBounds(x, y)) { return }
    if (!this.isAllowed(ch)) { return }
    if (this.glyphAt(x, y) === ch) { return }
    const index = this.indexAt(x, y)
    this.s = this.s.substr(0, index) + ch + this.s.substr(index + ch.length)
  }

  this.clean = function (str) {
    let s = `${str}`
    s = s.replace(/\n/g, '').trim()
    s = s.substr(0, this.w * this.h)
    return s
  }

  // Fns

  this.parse = function () {
    const a = []
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const g = this.glyphAt(x, y)
        const fn = this.cast(g, x, y)
        if (fn) {
          a.push(fn)
        }
      }
    }
    return a
  }

  this.cast = function (g, x, y) {
    if (g === '.') { return }
    if (!library[g.toLowerCase()]) { return }
    const passive = g === g.toUpperCase()
    return new library[g.toLowerCase()](this, x, y, passive)
  }

  this.operate = function (fns) {
    this.release()
    for (const id in fns) {
      const fn = fns[id]
      if (this.lockAt(fn.x, fn.y)) { continue }
      if (fn.passive || fn.bang()) {
        fn.haste()
        fn.permissions()
      }
    }
    for (const id in fns) {
      const fn = fns[id]
      if (this.lockAt(fn.x, fn.y)) { continue }
      if (fn.passive || fn.bang()) {
        fn.run()
      }
    }
  }

  // Locks

  this.release = function () {
    this.locks = []
  }

  this.unlock = function (x, y) {
    const index = this.locks.indexOf(`${x}:${y}`)
    this.locks.splice(index, 1)
  }

  this.lock = function (x, y) {
    if (this.lockAt(x, y)) { return }
    this.locks.push(`${x}:${y}`)
  }

  // Helpers

  this.inBounds = function (x, y) {
    return x >= 0 && x < this.w && y >= 0 && y < this.h
  }

  this.isAllowed = function (g) {
    return !!library[`${g}`.toLowerCase()]
  }

  this.keyOf = function (val) {
    return this.keys[val % this.keys.length]
  }

  this.valueOf = function (g) {
    return g !== '.' && this.isAllowed(g) ? this.keys.indexOf(`${g}`.toLowerCase()) : 0
  }

  this.indexAt = function (x, y) {
    return x + (this.w * y)
  }

  this.glyphAt = function (x, y, req = null) {
    return this.s.charAt(this.indexAt(x, y))
  }

  this.lockAt = function (x, y) {
    return this.locks.indexOf(`${x}:${y}`) > -1
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
    return this.format()
  }

  this.reset()
}

module.exports = Orca
