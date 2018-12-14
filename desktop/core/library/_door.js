'use strict'

const Operator = require('../operator')

function OperatorDoor (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '/', true)

  this.name = 'door'
  this.info = 'Hosts a nested Orca grid.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.haste.id = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const id = this.listen(this.ports.haste.id)
    if (!orca.terminal.rooms[id]) { return }

    const val = this.listen(this.ports.input.val)
    const room = orca.terminal.rooms[id]
    room.input(val)
    room.run()
    const res = room.output()
    this.output(`${res}`)
  }
}

module.exports = OperatorDoor
