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

  this.length = function () {
    return this.midi.stack.length + this.bridge.stack.length
  }

  this.toString = function () {
    let text = ''
    for (let i = 0; i < this.length(); i++) {
      text += '|'
    }
    while (text.length - 1 <= terminal.size.grid.w) {
      text += '-'
    }
    return text
  }
}

module.exports = IO
