'use strict'

import transpose from './transpose.js'

export default function Operator (orca, x, y, glyph = '.', passive = false) {
  this.name = 'unknown'
  this.x = x
  this.y = y
  this.passive = passive
  this.draw = passive
  this.glyph = passive ? glyph.toUpperCase() : glyph
  this.info = '--'
  this.ports = { input: {}, haste: {}, bang: !passive }

  // Actions

  this.listen = function (port, toValue = false) {
    if (!port) { return (toValue ? 0 : '.') }
    const g = orca.glyphAt(this.x + port.x, this.y + port.y)
    const glyph = (g === '.' || g === '*') && port.default ? port.default : g
    if (toValue) {
      const min = port.clamp && port.clamp.min ? port.clamp.min : 0
      const max = port.clamp && port.clamp.max ? port.clamp.max : 36
      return clamp(orca.valueOf(glyph), min, max)
    }
    return glyph
  }

  this.output = function (g) {
    if (!this.ports.output) { console.warn(this.name, 'Trying to output, but no port'); return }
    if (!g) { return }
    orca.write(this.x + this.ports.output.x, this.y + this.ports.output.y, this.requireUC() === true ? `${g}`.toUpperCase() : g)
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
    this.draw = true
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
    if (collider !== '*' && collider !== '.') { this.explode(); return }
    this.erase()
    this.x += x
    this.y += y
    this.replace(this.glyph)
    this.lock()
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
    const a = []
    if (this.draw === true) {
      a.push([this.x, this.y, 0, `${this.name.charAt(0).toUpperCase() + this.name.substring(1).toLowerCase()}`])
    }
    if (!this.passive) { return a }
    for (const id in this.ports.haste) {
      const port = this.ports.haste[id]
      a.push([this.x + port.x, this.y + port.y, 1, `${this.glyph}-${id}`])
    }
    for (const id in this.ports.input) {
      const port = this.ports.input[id]
      a.push([this.x + port.x, this.y + port.y, 2, `${this.glyph}-${id}`])
    }
    if (this.ports.output) {
      const port = this.ports.output
      a.push([this.x + port.x, this.y + port.y, port.reader || port.bang ? 8 : 3, `${this.glyph}-output`])
    }
    return a
  }

  this.requireUC = function (ports = this.ports.input) {
    if (this.ports.output.sensitive !== true) { return false }
    for (const id in ports) {
      const value = this.listen(ports[id])
      if (value.length !== 1) { continue }
      if (value.toLowerCase() === value.toUpperCase()) { continue }
      if (`${value}`.toUpperCase() === `${value}`) { return true }
    }
    return false
  }

  // Notes tools

  this.transpose = function (n, o = 3) {
    if (!transpose[n]) { return { note: n, octave: o } }
    const note = transpose[n].charAt(0)
    const octave = clamp(parseInt(transpose[n].charAt(1)) + o, 0, 8)
    const value = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'].indexOf(note)
    const id = clamp((octave * 12) + value, 0, 127)
    const real = id < 89 ? Object.keys(transpose)[id - 45] : null
    return { id, value, note, octave, real }
  }

  // Docs

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
