'use strict'

const Fn = require('../fn')

function FnP (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'p', passive)
}

module.exports = FnP
