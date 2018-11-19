'use strict'

function Pico (w, h) {
  this.f = 0 // Frame
  this.w = w // Width
  this.h = h // Height
  this.s = '' // String
  this.r = '' // Record

  this.lib = {}
  this.allowed = []
  this.locks = []
  this.ports = {}
  this.runtime = []

  function makeDocs (lib) {
    const h = {}
    for (const id in lib) {
      const fn = new lib[id]()
      h[fn.glyph] = fn.name
    }
    return h
  }

  this.start = function (path) {
    this.lib = require('./lib')
    this.allowed = [].concat(Object.keys(this.lib.num)).concat(Object.keys(this.lib.alpha)).concat(Object.keys(this.lib.special))
    this.clear()
  }

  this.clear = function () {
    this.r = ''
    this.s = ''
    let y = 0
    while (y < this.h) {
      let x = 0
      while (x < this.w) {
        this.s += '.'
        x += 1
      }
      y += 1
    }
  }

  this.run = function () {
    this.runtime = this.findFns()
    this.ports = this.findPorts()
    this.runFns(this.runtime)
    this.s = this.s.substr(0, this.w * this.h)
    this.f += 1
  }

  this.load = function (w, h, s) {
    this.w = w // Width
    this.h = h // Height
    this.f = 0
    this.clear()
    this.s = s.replace(/\n/g, '').trim() // String
  }

  this.add = function (x, y, ch) {
    const glyph = ch.substr(0, 1)
    if (!this.isAllowed(glyph)) { return }
    if (!this.inBounds(x, y)) { return }
    if (this.glyphAt(x, y) === ch) { return }
    const index = this.indexAt(x, y)
    this.s = this.s.substr(0, index) + glyph + this.s.substr(index + glyph.length)
  }

  this.remove = function (x, y) {
    this.add(x, y, '.')
  }

  // Fns

  this.findFns = function () {
    const a = []
    let y = 0
    while (y < this.h) {
      let x = 0
      while (x < this.w) {
        const g = this.glyphAt(x, y)
        const fn = this.makeFn(g, x, y)
        if (fn) {
          a.push(fn)
        }
        x += 1
      }
      y += 1
    }
    return a
  }

  this.makeFn = function (g, x, y) {
    if (g === '.') { return }

    if (this.lib.special[g]) {
      return new this.lib.special[g](this, x, y)
    }

    if (this.lib.alpha[g.toLowerCase()]) {
      const passive = g === g.toUpperCase()
      return new this.lib.alpha[g.toLowerCase()](this, x, y, passive)
    }
  }

  this.runFns = function (fns) {
    this.release()
    for (const id in fns) {
      const fn = fns[id]
      if (this.lockAt(fn.x, fn.y)) { continue }
      if (fn.passive || fn.bang()) {
        fn.init()
        fn.haste()
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

  this.findPorts = function () {
    const h = {}
    for (const id in pico.runtime) {
      const g = pico.runtime[id]
      if (this.lockAt(g.x, g.y)) { continue }
      // Default/Passive
      h[`${g.x}:${g.y}`] = { type: g.passive ? 'passive' : 'none', name: `${g.name}` }
      // Output
      if (g.ports.output) { h[`${g.x + g.ports.output.x}:${g.y + g.ports.output.y}`] = { type: 'output', name: `${g.glyph}.out` } }
      // Haste
      for (const id in g.ports.haste) {
        const port = g.ports.haste[id]
        h[`${g.x + port.x}:${g.y + port.y}`] = { type: 'haste', name: `${g.glyph}'${id}` }
      }
      // Input
      for (const id in g.ports.input) {
        const port = g.ports.input[id]
        h[`${g.x + port.x}:${g.y + port.y}`] = { type: 'input', name: `${g.glyph}:${id}` }
      }
    }
    return h
  }

  // Checks

  this.inBounds = function (x, y) {
    return x >= 0 && x < this.w && y >= 0 && y < this.h
  }

  this.isAllowed = function (g) {
    return this.lib.alpha[g.toLowerCase()] || this.lib.num[g] || this.lib.special[g]
  }

  this.valueOf = function (g) {
    return g !== '.' && this.isAllowed(g) ? this.allowed.indexOf(`${g}`.toLowerCase()) : 0
  }

  this.glyphAt = function (x, y, req = null) {
    return this.s.charAt(this.indexAt(x, y))
  }

  this.portAt = function (x, y, req = null) {
    return this.ports[`${x}:${y}`]
  }

  this.lockAt = function (x, y) {
    return this.locks.indexOf(`${x}:${y}`) > -1
  }

  this.indexAt = function (x, y) {
    return x + (this.w * y)
  }

  // Blocks

  this.getBlock = function (x, y, w, h) {
    let _y = y
    const block = []
    while (_y < y + h) {
      let _x = x
      const line = []
      while (_x < x + w) {
        line.push(this.glyphAt(_x, _y))
        _x++
      }
      block.push(line)
      _y++
    }
    return block
  }

  this.addBlock = function (x, y, block) {
    if (!block || block.length === 0) { return }

    let _y = y
    for (const lineId in block) {
      let _x = x
      for (const glyphId in block[lineId]) {
        this.add(_x, _y, block[lineId][glyphId])
        _x++
      }
      _y++
    }
  }

  this.removeBlock = function (x, y, w, h) {
    let _y = y
    while (_y < y + h) {
      let _x = x
      while (_x < x + w) {
        this.remove(_x, _y)
        _x++
      }
      _y++
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
    this.locks.push(`${x}:${y}`)
  }

  // Tools

  this.output = function () {
    const a = []
    for (let y = 0; y < this.h; y++) {
      const from = y * this.w
      const to = this.w
      a.push(this.s.substr(from, to))
    }
    return a.reduce((acc, val) => {
      return `${acc}${val}\n`
    }, '')
  }

  this.toString = function () {
    return this.output()
  }
}

module.exports = Pico
