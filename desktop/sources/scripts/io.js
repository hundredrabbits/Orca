'use strict'

function IO (terminal) {
  const dgram = require('dgram')
  const Bridge = require('../../core/bridge')

  this.bridge = new Bridge(this)

  this.midi = { device: 0 }
  this.outputs = []
  this.stack = { }

  this.start = function () {
    this.bridge.start()
    this.clear()
    this.midiSetup()
  }

  this.clear = function () {
    this.stack.udp = []
    this.stack.midi = []
  }

  this.run = function () {
    if (this.length() < 1) { return }

    for (const id in this.stack.udp) {
      this.playUdp(this.stack.udp[id])
    }
    for (const id in this.stack.midi) {
      this.playMidi(this.stack.midi[id])
    }
  }

  this.update = function () {
    // Update Bridge Menu
    terminal.controller.clearCat('default', 'UDP Bridge')
    for (const id in this.bridge.routes) {
      console.log(terminal.io.bridge.active, id)
      terminal.controller.add('default', 'UDP Bridge', `${this.bridge.routes[id].name} ${terminal.io.bridge.active === id ? ' — Active' : ''}`, () => { terminal.io.bridge.select(id) }, '')
    }

    // Update Midi Menu
    terminal.controller.clearCat('default', 'Midi')
    const devices = terminal.io.listMidiDevices()
    for (const id in devices) {
      terminal.controller.add('default', 'Midi', `${devices[id].name} ${terminal.io.midi.device === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.setMidiDevice(id + 1) }, '')
    }
    if (devices.length < 1) {
      terminal.controller.add('default', 'Midi', `No Device Available`)
    }
    // Save
    terminal.controller.commit()
  }

  // UDP

  this.sendUdp = function (msg) {
    this.stack.udp.push(msg)
  }

  this.playUdp = function (data) {
    const udp = dgram.createSocket('udp4')
    udp.send(Buffer.from(`${data}`), 49160, 'localhost', (err) => {
      udp.close()
    })
  }

  // Midi

  this.sendMidi = function (channel, octave, note, velocity, length) {
    this.stack.midi.push([channel, octave, note, velocity, length])
  }

  this.playMidi = function (data) {
    const device = this.midi.device
    const channel = convertChannel(data[0])
    const note = convertNote(data[1], data[2])
    const velocity = data[3]
    const length = window.performance.now() + convertLength(data[4], terminal.bpm)

    if (!this.outputs[device]) { console.warn('No midi device!'); return }

    this.outputs[device].send([channel[0], note, velocity])
    this.outputs[device].send([channel[1], note, velocity], length)
  }

  this.setMidiDevice = function (id = 0) {
    this.midi.device = clamp(id, 0, this.outputs.length - 1)
    console.log(this.outputs[this.midi.device] ? `Set device to #${this.midi.device} — ${this.outputs[this.midi.device].name}` : 'Missing midi device with id.')
    terminal.io.update()
    return this.outputs[this.midi.device]
  }

  this.listMidiDevices = function () {
    return this.outputs
  }

  //

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

  // Setup

  this.midiSetup = function () {
    if (!navigator.requestMIDIAccess) { return }

    navigator.requestMIDIAccess({ sysex: false }).then(this.midiActive, this.midiInactive)
  }

  this.midiActive = function (midiAccess) {
    const iter = midiAccess.outputs.values()
    for (let i = iter.next(); i && !i.done; i = iter.next()) {
      terminal.io.outputs.push(i.value)
    }
    terminal.io.update()
    console.log(terminal.io.outputs[terminal.io.midi.device] ? `Midi is active, devices(${terminal.io.midi.device + 1}/${terminal.io.outputs.length}): ${terminal.io.outputs[terminal.io.midi.device].name}` : 'No Midi device')
  }

  this.midiInactive = function (err) {
    console.warn('No Midi', err)
  }

  this.length = function () {
    return this.stack.udp.length + this.stack.midi.length
  }

  this.toString = function () {
    if (this.outputs.length < 1) { return 'No Midi' }
    let text = ''
    for (let i = 0; i < this.length(); i++) {
      text += '|'
    }
    while (text.length - 1 <= terminal.size.grid.w) {
      text += '-'
    }
    return text
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = IO
