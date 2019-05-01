'use strict'

const transpose = require('./transpose')

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

  this.listen = function (port, toValue = false) {
    if (!port) { return (toValue ? 0 : '.') }
    const g = orca.glyphAt(this.x + port.x, this.y + port.y)
    if (g === '.' && port.default) { return port.default }
    if (toValue) {
      const min = port.clamp && port.clamp.min ? port.clamp.min : 0
      const max = port.clamp && port.clamp.max ? port.clamp.max : 35
      return clamp(orca.valueOf(g), min, max)
    }
    return g
  }

  this.output = function (g) {
    if (!this.ports.output) { console.warn(this.name, 'Trying to output, but no port'); return }
    if (!g) { return }
    orca.write(this.x + this.ports.output.x, this.y + this.ports.output.y, this.isUpperCase() === true ? `${g}`.toUpperCase() : g)
  }

  this.bang = function (b) {
    if (!this.ports.output) { console.warn(this.name, 'Trying to bang, but no port'); return }
    orca.write(this.x + this.ports.output.x, this.y + this.ports.output.y, b === true ? '*' : '.')
  }

  // Phases

  this.permissions = function () {
    for (const id in this.ports.input) {
      const port = this.ports.input[id]
      orca.lock(this.x + port.x, this.y + port.y)
    }
    if (this.ports.output) {
      orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y)
    }
  }

  this.haste = function () {
  }

  this.operation = function () {

  }

  this.run = function (force = false) {
    const payload = this.operation(force)
    if (this.ports.output) {
      if (this.ports.output.bang === true) {
        this.bang(payload)
      } else {
        this.output(payload)
      }
    }
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

  this.neighborLike = function (g) {
    if (orca.glyphAt(this.x + 1, this.y) === g) { return { x: 1, y: 0 } }
    if (orca.glyphAt(this.x - 1, this.y) === g) { return { x: -1, y: 0 } }
    if (orca.glyphAt(this.x, this.y + 1) === g) { return { x: 0, y: 1 } }
    if (orca.glyphAt(this.x, this.y - 1) === g) { return { x: 0, y: -1 } }
    return false
  }

  this.hasNeighbor = function (g) {
    if (orca.glyphAt(this.x + 1, this.y) === g) { return true }
    if (orca.glyphAt(this.x - 1, this.y) === g) { return true }
    if (orca.glyphAt(this.x, this.y + 1) === g) { return true }
    if (orca.glyphAt(this.x, this.y - 1) === g) { return true }
    return false
  }

  // Docs

  this.getPorts = function () {
    if (!this.passive) { return [] }
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

  this.isUpperCase = function (ports = this.ports.input) {
    if (this.ports.output.sensitive !== true) { return false }
    for (const id in ports) {
      const value = this.listen(ports[id])
      if (isUpperCase(value) === false) {
        return false
      }
    }
    return true
  }

  // Notes tools

  this.transpose = function (n, o = 3) {
    if (!transpose[n]) { return { note: n, octave: o } }
    const note = this.normalize(transpose[n].charAt(0))
    const octave = clamp(parseInt(transpose[n].charAt(1)) + o, 0, 8)
    const value = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'].indexOf(note)
    const id = clamp((octave * 12) + value, 0, 127)
    const real = id < 89 ? Object.keys(transpose)[id - 45] : null
    return { id, value, note, octave, real }
  }

  this.normalize = function (n) {
    return n === 'e' ? 'F' : n === 'b' ? 'C' : n
  }

  // Docs

  this.docs = function () {
    return `\`${this.glyph.toUpperCase()}\` **${this.name}**: ${this.info}`
  }

  function isUpperCase (a) { return isNaN(a) && `${a}`.toUpperCase() === `${a}` }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Operator
