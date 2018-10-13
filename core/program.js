'use strict'

function Program (w, h) {
  const lib = {
    A: require('./programs/a'),
    B: require('./programs/b'),
    C: require('./programs/c'),
    D: require('./programs/d'),
    E: require('./programs/e'),
    F: require('./programs/f'),
    G: require('./programs/g'),
    H: require('./programs/h'),
    I: require('./programs/i'),
    J: require('./programs/j'),
    K: require('./programs/k'),
    L: require('./programs/l'),
    M: require('./programs/m'),
    N: require('./programs/n'),
    O: require('./programs/o'),
    P: require('./programs/p'),
    Q: require('./programs/q'),
    R: require('./programs/r'),
    S: require('./programs/s'),
    T: require('./programs/t'),
    U: require('./programs/u'),
    V: require('./programs/v'),
    W: require('./programs/w'),
    X: require('./programs/x'),
    Y: require('./programs/y'),
    Z: require('./programs/z')
  }

  this.f = 0
  this.w = w
  this.h = h
  this.s = ''
  this.r = '' // Record

  this.locks = []
  this.progs = []
  this.glyphs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.']

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
    if (x < 0 || x > this.w - 1 || y < 0 || y > this.h - 1 || !glyph) { return }

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
          this.progs.push(new lib[`${g.toUpperCase()}`](this, x, y))
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

  this.is_prog = function (g) {
    return this.glyphs.indexOf(g) >= 9 && this.glyphs.indexOf(g) <= 35 && lib[`${g.toUpperCase()}`]
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

module.exports = Program
