'use strict'

const Fn = require('../fn')

function FnZ (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'z', isPassive)
}

module.exports = FnZ
