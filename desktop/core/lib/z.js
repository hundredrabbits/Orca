'use strict'

const Fn = require('../fn')

function FnZ (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'z', passive)
}

module.exports = FnZ
