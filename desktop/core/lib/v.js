'use strict'

const FnBase = require('./_base')

function FnV (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'v', isPassive)

  this.name = 'values'
  this.info = 'Count the number of fns present eastwardly.'

  // this.ports.push({ x: 0, y: 1, output: true })
  // this.ports.push({ x: -1, y: 0, input: true })

  // if (pico) {
  //   this.w = this.west()
  //   this.len = this.w ? pico.valueOf(this.w.glyph) : 0
  //   for (let x = 1; x <= this.len; x++) {
  //     this.ports.push({ x: x, y: 0, input: true })
  //   }
  // }

  this.haste = function () {
    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
    pico.lock(this.x, this.y + 1)
  }

  this.operation = function () {
    if (!this.len || this.len < 1) { return }
    let count = 0
    for (let x = 1; x <= this.len; x++) {
      const g = pico.glyphAt(this.x + x, this.y)
      if (g !== '.') { count++ }
    }
    const ch = pico.valueOf(`${count}`)
    pico.add(this.x, this.y + 1, `${pico.allowed[ch]}`)
  }
}

module.exports = FnV
