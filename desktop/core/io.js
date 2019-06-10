'use strict'

import Midi from './io/midi.js'
import MidiCC from './io/cc.js'
import Mono from './io/mono.js'
import Udp from './io/udp.js'
import Osc from './io/osc.js'

export default function IO (terminal) {
  this.ip = '127.0.0.1'

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

  this.setIp = function (addr = '127.0.0.1') {
    if (validateIP(addr) !== true) { console.warn('IO', 'Invalid IP'); return }
    this.ip = addr
    console.log('IO', 'Set target IP to ' + this.ip)
    this.osc.setup()
  }

  this.length = function () {
    return this.midi.length() + this.mono.length() + this.cc.stack.length + this.udp.stack.length + this.osc.stack.length
  }

  this.inspect = function (limit = terminal.grid.w) {
    let text = ''
    for (let i = 0; i < this.length(); i++) {
      text += '|'
    }
    return fill(text, limit, '.')
  }

  function validateIP (addr) { return !!(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addr)) }
  function fill (str, len, chr) { while (str.length < len) { str += chr }; return str }
}
