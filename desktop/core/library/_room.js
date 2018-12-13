'use strict'

const Operator = require('../operator')

function OperatorRoom (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '/', true)

  this.name = 'room'
  this.info = 'Hosts a nested Orca grid.'

  this.ports.haste.id = { x: -1, y: 0 }

  this.run = function () {
    const id = this.listen(this.ports.haste.id)
    // console.log(id,orca.terminal.rooms[id])
    // orca.terminal.rooms[id].run()
  }
}

module.exports = OperatorRoom
