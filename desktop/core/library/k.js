'use strict'

const Operator = require('../operator')

function OperatorK (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'k', passive)

  this.name = 'konkat'
  this.info = 'Outputs multiple variables.'

  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    this.len = this.listen(this.ports.haste.len, true)
    for (let x = 1; x <= this.len; x++) {
      orca.lock(this.x + x, this.y)
      const g = orca.glyphAt(this.x + x, this.y)
      if (g !== '.') {
        orca.lock(this.x + x, this.y + 1)
      }
    }
  }

  this.run = function () {
    const a = []
    for (let x = 1; x <= this.len; x++) {
      const key = orca.glyphAt(this.x + x, this.y)
      orca.write(this.x + x, this.y + 1, orca.values[key])
    }
  }
}

module.exports = OperatorK
