'use strict'

function Orca (library) {
  this.keys = Object.keys(library).slice(0, 36)

  this.w = 1 // Default Width
  this.h = 1 // Default Height
  this.f = 0 // Frame
  this.s = '' // String

  this.locks = []
  this.runtime = []
  this.variables = {}

  this.run = function () {
    this.runtime = this.parse()
    this.operate(this.runtime)
    this.f += 1
  }

  this.reset = function (w = this.w, h = this.h) {
    this.f = 0
    this.w = w
    this.h = h
    this.replace(new Array((this.h * this.w) + 1).join('.'))
  }

  this.load = function (w, h, s, f = 0) {
    this.w = w
    this.h = h
    this.f = f
    this.replace(this.clean(s))
    return this
  }

  this.write = function (x, y, g) {
    if (!g) { return false }
    if (g.length !== 1) { return false }
    if (!this.inBounds(x, y)) { return false }
    if (this.glyphAt(x, y) === g) { return false }
    const index = this.indexAt(x, y)
    const glyph = !this.isAllowed(g) ? '.' : g
    const string = this.s.substr(0, index) + glyph + this.s.substr(index + 1)
    this.replace(string)
    return true
  }

  this.clean = (str) => {
    return `${str}`.replace(/\n/g, '').trim().substr(0, this.w * this.h).split('').map((g) => {
      return !this.isAllowed(g) ? '.' : g
    }).join('')
  }

  this.replace = function (s) {
    this.s = s
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
    const passive = g === g.toUpperCase()
    return new library[g.toLowerCase()](this, x, y, passive)
  }

  this.operate = function (operators) {
    this.release()
    for (const operator of operators) {
      if (this.lockAt(operator.x, operator.y)) { continue }
      if (operator.passive || operator.hasNeighbor('*')) {
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
    return { w, h }
  }

  // Blocks

  this.getBlock = (x, y, w, h) => {
    const block = []
    for (let _y = y; _y < y + h; _y++) {
      const line = []
      for (let _x = x; _x < x + w; _x++) {
        line.push(this.glyphAt(_x, _y))
      }
      block.push(line)
    }
    return block
  }

  this.writeBlock = (x, y, block, overlap = false) => {
    if (!block || block.length === 0) { return }
    let _y = y
    for (const line of block) {
      let _x = x
      for (const y in line) {
        const glyph = line[y]
        client.orca.write(_x, _y, overlap === true && glyph === '.' ? this.glyphAt(_x, _y) : glyph)
        _x++
      }
      _y++
    }
  }

  // Locks

  this.release = function () {
    this.locks = new Array(this.w * this.h)
    this.variables = {}
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
    return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < this.w && y >= 0 && y < this.h
  }

  this.isAllowed = function (g) {
    return g === '.' || !!library[`${g}`.toLowerCase()]
  }

  this.isSpecial = function (g) {
    return g.toLowerCase() === g.toUpperCase() && isNaN(g)
  }

  this.keyOf = function (val, uc = false) {
    return uc === true ? this.keys[val % 36].toUpperCase() : this.keys[val % 36]
  }

  this.valueOf = function (g) {
    return !g || g === '.' || g === '*' ? 0 : this.keys.indexOf(`${g}`.toLowerCase())
  }

  this.indexAt = function (x, y) {
    return this.inBounds(x, y) === true ? x + (this.w * y) : -1
  }

  this.operatorAt = function (x, y) {
    return this.runtime.filter((item) => { return item.x === x && item.y === y })[0]
  }

  this.posAt = function (index) {
    return { x: index % this.w, y: parseInt(index / this.w) }
  }

  this.glyphAt = function (x, y) {
    return this.s.charAt(this.indexAt(x, y))
  }

  this.valueAt = function (x, y) {
    return this.valueOf(this.glyphAt(x, y))
  }

  this.lockAt = function (x, y) {
    return this.locks[this.indexAt(x, y)] === true
  }

  this.valueIn = function (key) {
    return this.variables[key]
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

  this.length = function () {
    return this.strip().length
  }

  this.strip = function () {
    return this.s.replace(/[^a-zA-Z0-9+]+/gi, '').trim()
  }

  this.toString = function () {
    return this.format().trim()
  }

  this.reset()
}
