'use strict'

const Fn = require('../fn')

function FnU (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'u', passive)

  this.name = 'uturn'
  this.info = 'Reverses movement on inputs.'

  this.ports.haste.n = { x: 0, y: -1, unlock: true }
  this.ports.haste.e = { x: 1, y: 0, unlock: true }
  this.ports.haste.s = { x: 0, y: 1, unlock: true }
  this.ports.haste.w = { x: -1, y: 0, unlock: true }

  this.run = function () {
    for (const id in this.ports.haste) {
      this.flip(id, this.ports.haste[id])
    }
  }

  this.flip = function (id, vector) {
    const pos = { x: this.x + vector.x, y: this.y + vector.y }
    const g = orca.glyphAt(pos.x, pos.y).toLowerCase()

    if (g === '.') { return }
    if (!this.ports.haste[g]) { return }

    orca.write(pos.x, pos.y, id.toUpperCase())
  }
}

module.exports = FnU
