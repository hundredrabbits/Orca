'use strict'

import Operator from '../operator.js'

export default function OperatorG (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Writes distant operators with offset.'

  this.ports.haste.x = { x: -3, y: 0 }
  this.ports.haste.y = { x: -2, y: 0 }
  this.ports.haste.len = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const len = this.listen(this.ports.haste.len, true)
    for (let x = 1; x <= len; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.haste.len, true)
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true) + 1
    this.ports.output = { x: x, y: y }
    // Read
    for (let i = 0; i < len; i++) {
      const port = { x: i + 1, y: 0 }
      const value = this.listen(port)
      orca.write(this.x + x + i, this.y + y, value)
    }
  }
}
