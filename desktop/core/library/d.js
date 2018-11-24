'use strict'

const Fn = require('../fn')

function FnD (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'd', true)

  this.name = 'delay'
  this.info = 'Locks a tile with a timer.'

  this.ports.haste.timer = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    if (this.listen(this.ports.haste.timer, true) < 1) {
      this.ports.output.unlock = true
    }
  }

  this.run = function () {
    if (!this.bang()) { return }
    const res = this.listen(this.ports.haste.timer, true) - 1
    orca.write(this.x + this.ports.haste.timer.x, this.y + this.ports.haste.timer.y, `${res}`)
  }
}

module.exports = FnD
