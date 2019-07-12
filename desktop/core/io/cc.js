'use strict'

export default function MidiCC (terminal) {
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
    const device = terminal.io.midi.outputDevice()
    if (!device) { console.warn('MidiCC', `No Midi device.`); return }
    for (const id in this.stack) {
      const msg = this.stack[id]
      if (msg.type === 'cc') {
        this.sendCC(device, msg)
      } else if (msg.type === 'pb') {
        this.sendPB(device, msg)
      } else if (msg.type === 'pg') {
        this.sendPG(device, msg)
      } else {
        console.warn('Unknown message type')
      }
    }
  }

  this.setOffset = function (offset) {
    if (isNaN(offset)) { return }
    this.offset = offset
    console.log('MidiCC', 'Set offset to ' + this.offset)
  }

  this.sendCC = function (device, msg) {
    device.send([0xb0 + msg.channel, this.offset + msg.knob, msg.value])
  }

  this.sendPB = function (device, msg) {
    device.send([0xe0 + msg.channel, msg.lsb, msg.msb])
  }

  this.sendPG = function (device, msg) {
  	if (!isNaN(msg.bank)) {
  		device.send([0xb0 + msg.channel, 0, msg.bank])
  	}
    if (!isNaN(msg.sub)) {
    	device.send([0xb0 + msg.channel, 32, msg.sub])
    }
    device.send([0xc0 + msg.channel, msg.pgm ])
  }
}
