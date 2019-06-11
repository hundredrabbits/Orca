'use strict'

export default function Operator (orca, x, y, glyph = '.', passive = false) {
  this.name = 'unknown'
  this.x = x
  this.y = y
  this.passive = passive
  this.draw = passive
  this.glyph = passive ? glyph.toUpperCase() : glyph
  this.info = '--'
  this.ports = { bang: !passive }

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

  this.output = function (g, port = this.ports.output) {
    if (!port) { console.warn(this.name, 'Trying to output, but no port'); return }
    if (!g) { return }
    orca.write(this.x + port.x, this.y + port.y, this.shouldUpperCase() === true ? `${g}`.toUpperCase() : g)
  }

  this.bang = function (b) {
    if (!this.ports.output) { console.warn(this.name, 'Trying to bang, but no port'); return }
    orca.write(this.x + this.ports.output.x, this.y + this.ports.output.y, b === true ? '*' : '.')
  }

  // Phases

  this.run = function (force = false) {
    // Operate
    const payload = this.operation(force)
    // Permissions
    for (const id in this.ports) {
      orca.lock(this.x + this.ports[id].x, this.y + this.ports[id].y)
    }
    this.draw = true

    if (this.ports.output) {
      if (this.ports.output.bang === true) {
        this.bang(payload)
      } else {
        this.output(payload)
      }
    }
  }

  this.operation = function () {

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
    // this.lock()
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

  this.addPort = function (name, pos) {
    this.ports[name] = pos
  }

  this.getPorts = function () {
    const a = []
    if (this.draw === true) {
      a.push([this.x, this.y, 0, `${this.name.charAt(0).toUpperCase() + this.name.substring(1).toLowerCase()}`])
    }
    if (!this.passive) { return a }
    for (const id in this.ports) {
      const port = this.ports[id]
      const type = this.getPortType(id)
      a.push([this.x + port.x, this.y + port.y, type, `${this.glyph}-${id}`])
    }
    return a
  }

  this.getPortType = function (id) {
    const port = this.ports[id]
    if (port.output || id === 'output') {
      return port.reader || port.bang ? 8 : 3
    }
    if (port.x < 0 || port.y < 0) {
      return 1
    }
    return 2
  }

  this.shouldUpperCase = function (ports = this.ports) {
    if (!this.ports.output || !this.ports.output.sensitive) { return false }
    const value = this.listen({ x: 1, y: 0 })
    if (value.toLowerCase() === value.toUpperCase()) { return false }
    if (value.toUpperCase() !== value) { return false }
    return true
  }

  // Docs

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
