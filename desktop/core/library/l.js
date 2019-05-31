'use strict'

import Operator from '../operator.js'

export default function OperatorL (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'l', passive)

  this.name = 'loop'
  this.info = 'Moves eastward operands'

  this.ports.step = { x: -2, y: 0, default: '1' }
  this.ports.len = { x: -1, y: 0 }
  this.ports.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    for (let x = 1; x <= len; x++) {
      orca.lock(this.x + x, this.y)
    }

    const step = this.listen(this.ports.step, true)
    const index = orca.indexAt(this.x + 1, this.y)
    const seg = orca.s.substr(index, len)
    const res = seg.substr(len - step, step) + seg.substr(0, len - step)
    for (let x = 0; x < len; x++) {
      orca.write(this.x + x + 1, this.y, res.charAt(x))
    }
    return this.listen(this.ports.val)
  }
}
