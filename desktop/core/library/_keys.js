'use strict'

const Operator = require('../operator')

function OperatorKeys (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '!', true)

  this.name = 'keys'
  this.info = 'Bangs on keyboard input.'

  this.ports.output = { x: 0, y: 1 }

  this.run = function () {

  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorKeys
