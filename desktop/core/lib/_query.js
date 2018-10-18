'use strict'

const FnBase = require('./_base')

function FnQuery (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.name = 'query'
  this.glyph = ':'
  this.info = 'Call a function by name, freezes 3 characters eastward.'

  if (pico) {
    this.cmd = `${pico.glyphAt(this.x + 1, this.y)}${pico.glyphAt(this.x + 2, this.y)}${pico.glyphAt(this.x + 3, this.y)}`
    this.query = pico.lib.queries[this.cmd] ? new pico.lib.queries[this.cmd](pico, x + 3, y) : null
  }

  this.ports = [{ x: 0, y: 0, bang: true }, { x: 1, y: 0, input: true }, { x: 2, y: 0, input: true }, { x: 3, y: 0, input: true }]

  if (this.query) {
    for (const id in this.query.ports) {
      const port = this.query.ports[id]
      this.ports.push({ x: port.x + 3, y: port.y, bang: port.bang, output: port.output })
    }
  }

  this.haste = function () {
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
    if (this.query) {
      this.query.haste()
    }
  }

  this.run = function () {
    if (!this.north('*') && !this.west('*') && !this.south('*')) { return }
    if (!this.query) { pico.terminal.log(`Unknown query <${this.cmd}>`); return }
    if (this.cmd.indexOf('.') > -1) { return }
    this.query.run()
  }
}

module.exports = FnQuery
