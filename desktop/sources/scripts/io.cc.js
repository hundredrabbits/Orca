'use strict'

function MidiCC (terminal) {
  this.stack = []

  this.start = function () {
    console.info('MidiCC Starting..')
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
    const device = terminal.io.midi.device()
    if (device) {
      device.send([0xb0 + data[0], 64 + data[1], data[2]])
    } else {
      console.warn(`No Midi device.`)
    }
  }
}

module.exports = MidiCC
