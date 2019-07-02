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
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (channel, data1, data2, message) {
    this.stack.push([channel, data1, data2, message])
  }

  this.setOffset = function (offset) {
    if (isNaN(offset)) { return }
    this.offset = offset
    console.log('MidiCC', 'Set offset to ' + this.offset)
  }

  this.play = function (data) {
    const device = terminal.io.midi.outputDevice()
    if (!device) { console.warn('MidiCC', `No Midi device.`); return }
	switch (data[3]) {
		case 0: // CC
    		device.send([0xb0 + data[0], this.offset + data[1], data[2]])
			break
		case 1: // progchange
			device.send([0xc0 + data[0], data[1]])
			break
		case 2: // pitchbend
			device.send([0xe0 + data[0], data[1], data[2]])
			break
	}	
    

  }
}
