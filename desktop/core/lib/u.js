'use strict'

const Fn = require('../fn')

function FnU (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'u', passive)

  this.name = 'Uturn'
  this.info = 'Reverses movements.'

  const vectors = { n: { x: 0, y: -1 }, e: { x: 1, y: 0 }, s: { x: 0, y: 1 }, w: { x: -1, y: 0 } }

  this.run = function () {
    for (const id in vectors) {
      this.flip(id, vectors[id])
    }
  }

  this.flip = function (id, vector) {
    const pos = { x: this.x + vector.x, y: this.y + vector.y }
    const g = orca.glyphAt(pos.x, pos.y).toLowerCase()

    if (g === '.') { return }
    if (!vectors[g]) { return }

    orca.write(pos.x, pos.y, id.toUpperCase())
  }
}

module.exports = FnU
