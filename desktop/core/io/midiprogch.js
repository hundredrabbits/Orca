'use strict'

export default function MidiProgCh (terminal) {
  this.stack = []

  this.start = function () {
    console.info('MidiProgCh', 'Starting..')
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (channel, value) {
    this.stack.push([channel, value])
  }

  this.play = function (data) {
    const device = terminal.io.midi.outputDevice()
    if (!device) { console.warn('MidiProgCh', `No Midi device.`); return }
    device.send([0xc0 + data[0], data[1]])
  }
}
