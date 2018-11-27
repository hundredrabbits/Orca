'use strict'

const Operator = require('../operator')

function OperatorD (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'd', true)

  this.name = 'delay'
  this.info = 'Locks a tile with a timer.'

  this.ports.haste.tick = { x: -2, y: 0 }
  this.ports.haste.timer = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    if (this.listen(this.ports.haste.tick, true) < 1) {
      this.ports.output.unlock = true
    }
  }

  this.run = function () {
    const tick = this.listen(this.ports.haste.tick, true)
    const timer = this.listen(this.ports.haste.timer)
    orca.write(this.x + this.ports.haste.tick.x, this.y + this.ports.haste.tick.y, tick === 0 ? `${timer}` : `${tick - 1}`)
    this.ports.output.unlock = false
  }
}

module.exports = OperatorD
