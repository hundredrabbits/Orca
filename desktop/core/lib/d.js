'use strict'

const Fn = require('../fn')

function FnD (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'd', isPassive)
}

module.exports = FnD
