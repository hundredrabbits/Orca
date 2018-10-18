'use strict'

const FnBase = require('./_base')

function FnP (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.type = 'direction'
  this.name = 'push'
  this.glyph = 'p'
  this.info = 'Moves away, on bang.'
  this.ports.push({ x: 0, y: 0, bang: true })

  this.operation = function () {
    const origin = this.bang()

    if (!origin) { return }

    const direction = { x: this.x - origin.x, y: this.y - origin.y }
    const pushed = this.neighbor_by(direction.x, direction.y)

    this.move(direction.x, direction.y)

    if (pushed) {
      pico.add(this.x + (direction.x * 2), this.y + (direction.y * 2), pushed.glyph)
    }
  }
}

module.exports = FnP
