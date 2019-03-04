'use strict'

const Midi = require('./io.midi')
const Udp = require('./io.udp')
const Osc = require('./io.osc')

function IO (terminal) {
  this.midi = new Midi(terminal)
  this.udp = new Udp(terminal)
  this.osc = new Osc(terminal)

  this.start = function () {
    this.midi.start()
    this.udp.start()
    this.osc.start()
    this.clear()
  }

  this.clear = function () {
    this.midi.clear()
    this.udp.clear()
    this.osc.clear()
  }

  this.run = function () {
    this.midi.run()
    this.udp.run()
    this.osc.run()
  }

  this.length = function () {
    return this.midi.stack.length + this.udp.stack.length + this.osc.stack.length
  }

  this.inspect = function (limit = terminal.grid.w) {
    let text = ''
    for (let i = 0; i < this.length(); i++) {
      text += '|'
    }
    return fill(text, limit, '.')
  }

  function fill (str, len, chr) { while (str.length < len) { str += chr }; return str }
}

module.exports = IO
