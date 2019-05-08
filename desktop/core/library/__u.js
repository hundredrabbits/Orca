'use strict'

const Operator = require('../operator')

function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'Uclid'
  this.info = 'Bangs based on the Euclidean pattern.'

  this.ports.haste.rate = { x: -1, y: 0 }
  this.ports.input.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, bang: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.haste.rate, true)
    const mod = this.listen(this.ports.input.mod, true)

    console.log(5, 8, pattern(5, 8))
    return 1
  }
}

function pattern (step, max) {
  let groups = []

  for (let i = 0; i < max; i++) {
    groups.push([i < step ? 1 : 0])
  }

  let l = 0
  while (l = groups.length - 1) {
    let start = 0
    while (start < l && groups[0].join('') === groups[start].join('')) {
      start++
    }
    if (start === l) {
      break
    }

    let end = l
    while (end > 0 && groups[l].join('') === groups[end].join('')) {
      end--
    }
    if (end === 0) {
      break
    }

    const count = Math.min(start, l - end)

    groups = groups.slice(0, count).map((group, i) => {
      return group.concat(groups[l - i])
    }).concat(groups.slice(count, -count))
  }
  return [].concat.apply([], groups)
}

module.exports = OperatorU
