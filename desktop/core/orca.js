'use strict'

function Orca (library = {}) {
  this.w = 57 // Default Width
  this.h = 25 // Default Height
  this.s = '' // String
  this.f = 0 // Frame

  this.allowed = [].concat(Object.keys(library.num)).concat(Object.keys(library.alpha)).concat(Object.keys(library.special))
  this.locks = []
  this.ports = {}
  this.runtime = []

  this.start = function () {
    this.clear()
  }

  this.run = function () {
    this.runtime = this.parse()
    this.operate(this.runtime)
    this.f += 1
  }

  this.clear = function () {
    this.s = new Array((this.h * this.w) + 1).join('.')
  }

  this.load = function (w, h, s) {
    this.w = w
    this.h = h
    this.f = 0
    this.s = this.clean(s)
  }

  this.write = function (x, y, ch) {
    if (!this.inBounds(x, y)) { return }
    if (ch.length !== 1) { return }
    if (!this.isAllowed(ch)) { return }
    if (this.glyphAt(x, y) === ch) { return }
    const index = this.indexAt(x, y)
    this.s = this.s.substr(0, index) + ch + this.s.substr(index + ch.length)
  }

  this.erase = function (x, y) {
    this.write(x, y, '.')
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
        const fn = this.convert(g, x, y)
        if (fn) {
          a.push(fn)
        }
      }
    }
    return a
  }

  this.convert = function (g, x, y) {
    if (g === '.') { return }
    if (library.special[g]) {
      return new library.special[g](this, x, y)
    }
    if (library.alpha[g.toLowerCase()]) {
      const passive = g === g.toUpperCase()
      return new library.alpha[g.toLowerCase()](this, x, y, passive)
    }
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

  // Checks

  this.inBounds = function (x, y) {
    return x >= 0 && x < this.w && y >= 0 && y < this.h
  }

  this.isAllowed = function (g) {
    return library.alpha[g.toLowerCase()] || library.num[g] || library.special[g]
  }

  this.valueOf = function (g) {
    return g !== '.' && this.isAllowed(g) ? this.allowed.indexOf(`${g}`.toLowerCase()) : 0
  }

  this.typeOf = function (g) {
    return Object.keys(library.alpha).indexOf(g.toLowerCase()) > -1 ? 'alpha' : Object.keys(library.num).indexOf(g) > -1 ? 'num' : Object.keys(library.special).indexOf(g) > -1 ? 'special' : 'unknown'
  }

  this.glyphAt = function (x, y, req = null) {
    return this.s.charAt(this.indexAt(x, y))
  }

  this.lockAt = function (x, y) {
    return this.locks.indexOf(`${x}:${y}`) > -1
  }

  this.indexAt = function (x, y) {
    return x + (this.w * y)
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

  this.clear()
}

module.exports = Orca
