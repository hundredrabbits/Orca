'use strict'

const Fn = require('../fn')

function FnD (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'd', passive)
}

module.exports = FnD
