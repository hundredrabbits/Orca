'use strict'

const Fn = require('../fn')

function FnU (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'u', passive)

  this.name = 'uturn'
  this.info = 'Reverses movement on inputs.'

  this.ports.input.n = { x: 0, y: -1, unlock: true }
  this.ports.input.e = { x: 1, y: 0, unlock: true }
  this.ports.input.s = { x: 0, y: 1, unlock: true }
  this.ports.input.w = { x: -1, y: 0, unlock: true }

  this.run = function () {
    for (const id in this.ports.input) {
      this.flip(id, this.ports.input[id])
    }
  }

  this.flip = function (id, vector) {
    const pos = { x: this.x + vector.x, y: this.y + vector.y }
    const g = orca.glyphAt(pos.x, pos.y).toLowerCase()

    if (g === '.') { return }
    if (!this.ports.input[g]) { return }

    orca.write(pos.x, pos.y, id.toUpperCase())
  }
}

module.exports = FnU
