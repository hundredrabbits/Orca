'use strict'

function MidiCC (client) {
  this.stack = []
  this.offset = 64

  this.start = function () {
    console.info('MidiCC', 'Starting..')
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    if (this.stack.length < 1) { return }
    const device = client.io.midi.outputDevice()
    if (!device) { console.warn('CC', 'No Midi device.'); return }
    for (const id in this.stack) {
      const msg = this.stack[id]
      if (msg.type === 'cc' && !isNaN(msg.channel) && !isNaN(msg.knob) && !isNaN(msg.value)) {
        device.send([0xb0 + msg.channel, this.offset + msg.knob, msg.value])
      } else if (msg.type === 'pb' && !isNaN(msg.channel) && !isNaN(msg.lsb) && !isNaN(msg.msb)) {
        device.send([0xe0 + msg.channel, msg.lsb, msg.msb])
      } else if (msg.type === 'pg' && !isNaN(msg.channel)) {
        if (!isNaN(msg.bank)) { device.send([0xb0 + msg.channel, 0, msg.bank]) }
        if (!isNaN(msg.sub)) { device.send([0xb0 + msg.channel, 32, msg.sub]) }
        if (!isNaN(msg.pgm)) { device.send([0xc0 + msg.channel, msg.pgm]) }
      } else {
        console.warn('CC', 'Unknown message', msg)
      }
    }
  }

  this.setOffset = function (offset) {
    if (isNaN(offset)) { return }
    this.offset = offset
    console.log('CC', 'Set offset to ' + this.offset)
  }
}
