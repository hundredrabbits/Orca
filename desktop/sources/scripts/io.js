'use strict'

const Bridge = require('./io.bridge')
const Midi = require('./io.midi')

function IO (terminal) {
  this.midi = new Midi(terminal)
  this.bridge = new Bridge(terminal)

  this.start = function () {
    this.midi.start()
    this.bridge.start()
    this.clear()
  }

  this.clear = function () {
    this.midi.clear()
    this.bridge.clear()
  }

  this.run = function () {
    this.midi.run()
    this.bridge.run()
  }
}

module.exports = IO
