'use strict'

function Midi (terminal) {
  this.index = 0
  this.devices = []
  this.stack = []

  this.start = function () {
    console.info('Midi Starting..')
    this.setup()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id], this.device())
    }
  }

  this.update = function () {
    terminal.controller.clearCat('default', 'Midi')
    const devices = terminal.io.midi.list()
    for (const id in devices) {
      terminal.controller.add('default', 'Midi', `${devices[id].name} ${terminal.io.midi.index === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.midi.select(id) }, '')
    }
    if (devices.length < 1) {
      terminal.controller.add('default', 'Midi', `No Device Available`)
    }
    if (devices.length > 1) {
      terminal.controller.add('default', 'Midi', `Next Device`, () => { terminal.io.midi.next(id) }, 'CmdOrCtrl+Shift+M')
    }
    terminal.controller.commit()
  }

  // Midi

  this.send = function (channel, octave, note, velocity, length) {
    this.stack.push([channel, octave, note, velocity, length])
  }

  this.play = function (data = this.stack, device) {
    const channel = convertChannel(data[0])
    const note = convertNote(data[1], data[2])
    const velocity = data[3]
    const length = window.performance.now() + convertLength(data[4], terminal.bpm)

    if (!device) { console.warn('No midi device!'); return }

    device.send([channel[0], note, velocity])
    device.send([channel[1], note, velocity], length)
  }

  this.select = function (id) {
    if (!this.devices[id]) { return }
    this.index = parseInt(id)
    this.update()
    console.log(`Midi Device: ${this.device().name}`)
    return this.device()
  }

  this.device = function () {
    return this.devices[this.index]
  }

  this.list = function () {
    return this.devices
  }

  this.next = function () {
    this.select((this.index + 1) % this.devices.length)
  }

  // Setup

  this.setup = function () {
    if (!navigator.requestMIDIAccess) { return }
    navigator.requestMIDIAccess({ sysex: false }).then(this.access, (err) => {
      console.warn('No Midi', err)
    })
  }

  this.access = function (midiAccess) {
    const iter = midiAccess.outputs.values()
    for (let i = iter.next(); i && !i.done; i = iter.next()) {
      terminal.io.midi.devices.push(i.value)
    }
    terminal.io.midi.select(0)
  }

  this.toString = function () {
    return this.devices.length > 0 ? `${this.devices[this.index].name}` : 'No Midi'
  }

  function convertChannel (id) {
    // return [id + 144, id + 128].toString(16);
    if (id === 0) { return [0x90, 0x80] } // ch1
    if (id === 1) { return [0x91, 0x81] } // ch2
    if (id === 2) { return [0x92, 0x82] } // ch3
    if (id === 3) { return [0x93, 0x83] } // ch4
    if (id === 4) { return [0x94, 0x84] } // ch5
    if (id === 5) { return [0x95, 0x85] } // ch6
    if (id === 6) { return [0x96, 0x86] } // ch7
    if (id === 7) { return [0x97, 0x87] } // ch8
    if (id === 8) { return [0x98, 0x88] } // ch9
    if (id === 9) { return [0x99, 0x89] } // ch10
    if (id === 10) { return [0x9A, 0x8A] } // ch11
    if (id === 11) { return [0x9B, 0x8B] } // ch12
    if (id === 12) { return [0x9C, 0x8C] } // ch13
    if (id === 13) { return [0x9D, 0x8D] } // ch14
    if (id === 14) { return [0x9E, 0x8E] } // ch15
    if (id === 15) { return [0x9F, 0x8F] } // ch16
  }

  function convertNote (octave, note) {
    return 24 + (octave * 12) + note // 60 = C3
  }

  function convertLength (val, bpm) {
    return (60000 / bpm) * (val / 15)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Midi
