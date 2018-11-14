'use strict'

const FnBase = require('./_base')

function FnMidi (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends Midi'
}

module.exports = FnMidi
