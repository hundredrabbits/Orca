'use strict'

function MidiCC (terminal) {
  var mapping = require('../../sources/media/mappings/cc.json');

  if (!mapping) { console.warn('MidiCC', `Mapping not found`)}

  this.stack = []

  this.start = function () {
    console.info('MidiCC', 'Starting..')
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (channel, knob, value) {
    this.stack.push([channel, knob, value])
  }

  this.play = function (data) {
    const device = terminal.io.midi.outputDevice()
    if (!device) { console.warn('MidiCC', `No Midi device.`); return }
    if (mapping) {
      device.send([0xb0 + data[0], mapping[data[1].toString()], data[2]])
    }
    else  {
      device.send([0xb0 + data[0], 64 + data[1], data[2]])
    }
  }
}

module.exports = MidiCC
