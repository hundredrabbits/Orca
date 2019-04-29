'use strict'

const Midi = require('./io/midi')
const MidiCC = require('./io/cc')
const Mono = require('./io/mono')
const Udp = require('./io/udp')
const Osc = require('./io/osc')

function IO (terminal) {
  this.midi = new Midi(terminal)
  this.cc = new MidiCC(terminal)
  this.mono = new Mono(terminal)
  this.udp = new Udp(terminal)
  this.osc = new Osc(terminal)

  this.start = function () {
    this.midi.start()
    this.cc.start()
    this.mono.start()
    this.udp.start()
    this.osc.start()
    this.clear()
  }

  this.clear = function () {
    this.midi.clear()
    this.cc.clear()
    this.mono.clear()
    this.udp.clear()
    this.osc.clear()
  }

  this.run = function () {
    this.midi.run()
    this.cc.run()
    this.mono.run()
    this.udp.run()
    this.osc.run()
  }

  this.silence = function () {
    this.midi.silence()
    this.mono.silence()
  }

  this.length = function () {
    return this.midi.stack.length + this.cc.stack.length + this.udp.stack.length + this.osc.stack.length + this.mono.stack.length
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
