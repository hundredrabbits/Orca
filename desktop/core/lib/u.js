'use strict'

const Fn = require('../fn')

function FnU (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'u', passive)
}

module.exports = FnU
