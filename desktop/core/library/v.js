'use strict'

import Operator from '../operator.js'

export default function OperatorV (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'v', passive)

  this.name = 'variable'
  this.info = 'Reads and writes variable'

  this.ports.haste.write = { x: -1, y: 0 }
  this.ports.input.read = { x: 1, y: 0 }

  this.haste = function () {
    const write = this.listen(this.ports.haste.write)
    const read = this.listen(this.ports.input.read)
    if (write === '.' && read !== '.') {
      this.ports.output = { x: 0, y: 1 }
    }
  }

  this.operation = function (force = false) {
    const write = this.listen(this.ports.haste.write)
    const read = this.listen(this.ports.input.read)
    if (write !== '.') {
      orca.variables[write] = read
      return
    }
    return orca.valueIn(read)
  }
}
