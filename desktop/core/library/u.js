'use strict'

const Operator = require('../operator')

function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'uturn'
  this.info = 'Reverses movement of inputs.'

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

module.exports = OperatorU
