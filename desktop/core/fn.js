'use strict'

function Fn (pico, x, y, glyph = '.', passive = false) {
  this.name = 'unknown'
  this.x = x
  this.y = y
  this.passive = passive
  this.glyph = passive ? glyph.toUpperCase() : glyph
  this.info = '--'
  this.ports = { input: {}, haste: {}, bang: !passive }

  // Actions

  this.listen = function (port, toValue = false) {
    const g = pico.glyphAt(this.x + port.x, this.y + port.y)
    return toValue ? pico.toValue(g) : g
  }

  this.output = function (g) {
    pico.add(this.x + this.ports.output.x, this.y + this.ports.output.y, g)
  }

  // Phases

  this.init = function () {
    for (const id in this.ports.haste) {
      const port = this.ports.haste[id]
      pico.lock(this.x + port.x, this.y + port.y)
    }
    for (const id in this.ports.input) {
      const port = this.ports.input[id]
      pico.lock(this.x + port.x, this.y + port.y)
    }
    if (this.ports.output) {
      pico.lock(this.x, this.y + 1)
    }
  }

  this.haste = function () {

  }

  this.run = function () {

  }

  // Helpers

  this.lock = function () {
    pico.lock(this.x, this.y)
  }

  this.replace = function (g) {
    pico.add(this.x, this.y, g)
  }

  this.remove = function () {
    this.replace('.')
  }

  this.explode = function () {
    this.replace('*')
    this.lock()
  }

  this.move = function (x, y, g) {
    this.remove()
    this.x += x
    this.y += y
    this.replace(this.glyph)
  }

  this.bang = function () {
    if (pico.glyphAt(this.x + 1, this.y) === '*') { return true }
    if (pico.glyphAt(this.x - 1, this.y) === '*') { return true }
    if (pico.glyphAt(this.x, this.y + 1) === '*') { return true }
    if (pico.glyphAt(this.x, this.y - 1) === '*') { return true }
    return false
  }

  // Docs

  this._ports = function () {
    let ports = ''
    if (Object.keys(this.ports.haste).length > 0) {
      for (const name in this.ports.haste) {
        ports += `'${name}, `
      }
    }
    if (Object.keys(this.ports.haste).length > 0) {
      for (const name in this.ports.input) {
        ports += `${name}, `
      }
    }
    return ports !== '' ? '(' + ports.substr(0, ports.length - 2) + ')' : ''
  }

  this.docs = function () {
    let html = ''
    const ports = this._ports()

    return `\`${this.glyph.toUpperCase()}\` **${this.name}**${ports}: ${this.info}`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Fn
