'use strict'

import Operator from '../operator.js'

export default function OperatorV (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'v', passive)

  this.name = 'variable'
  this.info = 'Reads and writes variable'

  this.ports.write = { x: -1, y: 0 }
  this.ports.read = { x: 1, y: 0 }

  this.operation = function (force = false) {
    const write = this.listen(this.ports.write)
    const read = this.listen(this.ports.read)
    if (write === '.' && read !== '.') {
      this.ports.output = { x: 0, y: 1 }
    }
    if (write !== '.') {
      orca.variables[write] = read
      return
    }
    return orca.valueIn(read)
  }
}
