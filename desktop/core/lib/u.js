'use strict'

const Fn = require('../fn')

function FnU (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'u', isPassive)
}

module.exports = FnU
