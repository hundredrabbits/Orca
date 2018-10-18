'use strict'

const FnBase = require('./_base')

function FnQ (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'q', true)

  this.name = 'query'
  this.info = 'Call a function by name, freezes 3 characters eastward.'

  if (pico) {
    this.cmd = `${pico.glyphAt(this.x + 1, this.y)}${pico.glyphAt(this.x + 2, this.y)}${pico.glyphAt(this.x + 3, this.y)}`.toLowerCase()
    this.query = pico.lib.queries[this.cmd] ? new pico.lib.queries[this.cmd](pico, x + 3, y) : null
  }

  this.ports.push({ x: 1, y: 0, input: true })
  this.ports.push({ x: 2, y: 0, input: true })
  this.ports.push({ x: 3, y: 0, input: true })

  this.haste = function () {
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
    if (this.query) {
      this.query.haste()
    }
  }

  this.run = function () {
    if (!this.bang()) { return }
    if (!this.query) { pico.terminal.log(`Unknown query <${this.cmd}>`); return }
    if (this.cmd.indexOf('.') > -1) { return }
    this.query.run()
  }
}

module.exports = FnQ
