'use strict'

const FnBase = require('./_base')

function FnP (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'p', isPassive)

  this.name = 'push'
  this.info = 'Pushes direction fns away.'

  this.run = function () {
    const ns = this.neighbors()

    if (ns.length < 1) { return }

    for (const id in ns) {
      const n = ns[id]
      pico.add(n.x, n.y, n.x == this.x - 1 ? 'W' : n.x == this.x + 1 ? 'E' : n.y == this.y + 1 ? 'S' : 'N')
    }
  }
}

module.exports = FnP
