'use strict'

function Operator (orca, x, y, glyph = '.', passive = false) {
  this.name = 'unknown'
  this.x = x
  this.y = y
  this.passive = passive
  this.draw = true
  this.glyph = passive ? glyph.toUpperCase() : glyph
  this.info = '--'
  this.ports = { input: {}, haste: {}, bang: !passive }

  // Actions

  this.listen = function (port, toValue = false, min = 0, max = 36) {
    if (!port) { return toValue ? 0 : '.' }
    const g = orca.glyphAt(this.x + port.x, this.y + port.y)
    return toValue ? clamp(orca.valueOf(g), min, max) : g
  }

  this.output = function (g, lock = false) {
    if (!this.ports.output) { return }
    if (!g) { return }
    orca.write(this.x + this.ports.output.x, this.y + this.ports.output.y, g)
    if (lock) {
      orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y)
    }
  }

  // Phases

  this.permissions = function () {
    for (const id in this.ports.haste) {
      const port = this.ports.haste[id]
      if (!port.unlock) {
        orca.lock(this.x + port.x, this.y + port.y)
      }
    }
    for (const id in this.ports.input) {
      const port = this.ports.input[id]
      if (!port.unlock) {
        orca.lock(this.x + port.x, this.y + port.y)
      }
    }
    if (this.ports.output && !this.ports.output.unlock) {
      orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y)
    }
  }

  this.haste = function () {
  }

  this.run = function () {
  }

  // Helpers

  this.lock = function () {
    orca.lock(this.x, this.y)
  }

  this.replace = function (g) {
    orca.write(this.x, this.y, g)
  }

  this.erase = function () {
    this.replace('.')
  }

  this.explode = function () {
    this.replace('*')
    this.lock()
  }

  this.move = function (x, y) {
    const offset = { x: this.x + x, y: this.y + y }
    if (!orca.inBounds(offset.x, offset.y)) { this.explode(); return }
    const collider = orca.glyphAt(offset.x, offset.y)
    if (collider === this.glyph) { return }
    if (collider !== '*' && collider !== '.' && collider !== this.glyph) { this.explode(); return }
    this.erase()
    this.x += x
    this.y += y
    this.replace(this.glyph)
    this.lock()
  }

  this.bang = function () {
    if (orca.glyphAt(this.x + 1, this.y) === '*') { return { x: 1, y: 0 } }
    if (orca.glyphAt(this.x - 1, this.y) === '*') { return { x: -1, y: 0 } }
    if (orca.glyphAt(this.x, this.y + 1) === '*') { return { x: 0, y: 1 } }
    if (orca.glyphAt(this.x, this.y - 1) === '*') { return { x: 0, y: -1 } }
    return false
  }

  // Docs

  this.getPorts = function () {
    const a = []
    const TYPE = { operator: 0, haste: 1, input: 2, output: 3 }
    a.push([this.x, this.y, this.passive === true && this.draw === true ? TYPE.operator : 5, `${this.name.charAt(0).toUpperCase() + this.name.substring(1).toLowerCase()}`])
    for (const id in this.ports.haste) {
      const port = this.ports.haste[id]
      a.push([this.x + port.x, this.y + port.y, TYPE.haste, `${this.glyph}-${id}`])
    }
    for (const id in this.ports.input) {
      const port = this.ports.input[id]
      a.push([this.x + port.x, this.y + port.y, TYPE.input, `${this.glyph}-${id}`])
    }

    if (this.ports.output) {
      const port = this.ports.output
      a.push([this.x + port.x, this.y + port.y, TYPE.output, `${this.glyph}-output`])
    }
    return a
  }

  this.docs = function () {
    return `\`${this.glyph.toUpperCase()}\` **${this.name}**: ${this.info}`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Operator
