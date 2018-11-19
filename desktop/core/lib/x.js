'use strict'

const Fn = require('../fn')

function FnX (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'x', isPassive)
}

module.exports = FnX
