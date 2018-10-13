'use strict'

function Pico (w, h) {

  this.f = 0 // Frame
  this.w = w // Width
  this.h = h // Height
  this.s = '' // String
  this.r = '' // Record

  this.lib = {}
  this.docs = {}
  this.allowed = []
  this.locks = []
  this.progs = []

  function make_docs (lib) {
    const h = {}
    for (const id in lib) {
      const P = new lib[id]()
      h[P.glyph] = P.docs()
    }
    return h
  }

  this.start = function (path) {
    this.lib = require('./lib')
    this.allowed = [].concat(Object.keys(this.lib.num)).concat(Object.keys(this.lib.alpha)).concat(Object.keys(this.lib.special))
    this.docs = make_docs(Object.values(this.lib.alpha))
    this.reset()
  }

  this.reset = function () {
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

  this.add = function (x, y, glyph) {
    if (x < 0 || x > this.w - 1 || y < 0 || y > this.h - 1 || !glyph || !this.is_allowed(glyph)) { console.log(`#${glyph} not allowed`); return }

    const index = this.index_at(x, y)

    this.s = this.s.substr(0, index) + glyph + this.s.substr(index + glyph.length)
  }

  this.remove = function (x, y) {
    this.add(x, y, '.')
  }

  this.run = function () {
    this.unlock()
    this.progs = []

    // Find Programs
    let y = 0
    while (y < this.h) {
      let x = 0
      while (x < this.w) {
        const g = this.glyph_at(x, y)
        if (this.is_prog(g)) {
          this.progs.push(new this.lib.alpha[g](this, x, y))
        }
        x += 1
      }
      y += 1
    }

    // Operate
    for (const id in this.progs) {
      const p = this.progs[id]
      if (this.is_locked(p.x, p.y)) { continue }
      p.run()
    }

    this.record()

    this.s = this.s.substr(0, this.w * this.h)
  }

  this.clear = function () {
    this.r = ''
  }

  this.load = function(w,h,s)
  {
    this.w = w // Width
    this.h = h // Height
    this.reset()
    this.s = s.replace(/\n/g,'').trim() // String
  }

  this.is_prog = function (g) {
    return this.lib.alpha[g]
  }

  this.is_allowed = function (g) {
    return !!((this.lib.alpha[g] || this.lib.num[g] || this.lib.special[g]))
  }

  this.glyph_at = function (x, y, req = null) {
    return this.s.charAt(this.index_at(x, y))
  }

  this.glyph_like_at = function (x, y, target) {
    return this.s.charAt(this.index_at(x, y)) == target ? true : null
  }

  this.index_at = function (x, y) {
    return x + (this.w * y)
  }

  // Locks

  this.is_locked = function (x, y) {
    return this.locks.indexOf(`${x}:${y}`) > -1
  }

  this.unlock = function () {
    this.locks = []
  }

  this.lock = function (x, y) {
    this.locks.push(`${x}:${y}`)
  }

  // Tools

  this.output = function () {
    const origin = this.s.replace(/[^0-9a-z]/gi, '.')
    const lines = origin.match(/.{1,39}/g)
    return lines.reduce((acc, val) => {
      return `${acc}${val}\n`
    }, '')
  }

  this.record = function () {
    const g = this.s.substr(-1, 1)
    const last_g = this.r.substr(-1, 1)
    if (g == '.' && last_g == '.') { return }
    this.r += g

    // Trim
    if (this.r.length >= this.h) {
      this.r = this.r.substr(-this.h + 1, this.h)
    }
  }

  this.toString = function () {
    return this.output()
  }
}

module.exports = Pico
