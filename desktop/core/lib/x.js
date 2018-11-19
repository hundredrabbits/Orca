'use strict'

const Fn = require('../fn')

function FnX (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'x', passive)
}

module.exports = FnX
