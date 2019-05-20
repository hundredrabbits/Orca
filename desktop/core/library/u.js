'use strict'

import Operator from '../operator.js'

export default function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'uclid'
  this.info = 'Bangs on Euclidean rhythm'

  this.ports.haste.step = { x: -1, y: 0, clamp: { min: 0 }, default: '1' }
  this.ports.input.max = { x: 1, y: 0, clamp: { min: 1 }, default: '8' }
  this.ports.output = { x: 0, y: 1, bang: true }

  this.operation = function (force = false) {
    const step = this.listen(this.ports.haste.step, true)
    const max = this.listen(this.ports.input.max, true)
    const bucket = (step * (orca.f + max - 1)) % max + step
    return bucket >= max
  }
}
