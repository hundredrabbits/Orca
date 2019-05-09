'use strict'

import Operator from '../operator.js'

export default function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'Uclid'
  this.info = 'Bangs based on the Euclidean pattern.'

  this.ports.haste.step = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.input.max = { x: 1, y: 0, clamp: { min: 1 }, default: '8' }
  this.ports.output = { x: 0, y: 1, bang: true }

  this.operation = function (force = false) {
    const step = this.listen(this.ports.haste.step, true)
    const max = this.listen(this.ports.input.max, true)
    let segs = []
    for (let i = 0; i < max; i++) {
      segs.push([i < step ? 1 : 0])
    }
    let l = 0
    while (l = segs.length - 1) {
      let from = 0
      while (from < l && segs[0].join('') === segs[from].join('')) { from++ }
      if (from === l) { break }
      let to = l
      while (to > 0 && segs[l].join('') === segs[to].join('')) { to-- }
      if (to === 0) { break }
      const count = Math.min(from, l - to)
      segs = segs.slice(0, count).map((group, i) => {
        return group.concat(segs[l - i])
      }).concat(segs.slice(count, -count))
    }
    const sequence = [].concat.apply([], segs)
    return sequence[orca.f % sequence.length] === 1
  }
}
