'use strict'

function IO (terminal) {
  const dgram = require('dgram')

  this.outputs = []
  this.stack = null

  this.start = function () {
    this.clear()
    this.midiSetup()
  }

  this.clear = function () {
    this.stack = { udp: [], midi: [] }
  }

  this.run = function () {
    if (this.length() < 1) { return }
    // Run UDP first
    for (const id in this.stack.udp) {
      this.playUdp(this.stack.udp[id])
    }
    for (const id in this.stack.midi) {
      this.playMidi(this.stack.midi[id])
    }
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
    const channel = convertChannel(data[0])
    const note = convertNote(data[1], data[2])
    const velocity = data[3]
    const length = window.performance.now() + convertLength(data[4], terminal.bpm)

    this.outputs[0].send([channel[0], note, velocity])
    this.outputs[0].send([channel[1], note, velocity], length)
  }

  //

  function convertChannel (id) {
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
  }

  function convertNote (octave, note) {
    return 24 + (octave * 12) + note // 60 = C3
  }

  function convertLength (val, bpm) {
    return (60000 / bpm) / val
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
    console.log(`Midi is active, devices: ${terminal.io.outputs.length}`)
  }

  this.midiInactive = function (err) {
    console.warn('No Midi', err)
  }

  this.length = function () {
    return this.stack.udp.length + this.stack.midi.length
  }

  this.toString = function () {
    let text = ''
    for (let i = 0; i < this.length(); i++) {
      text += '|'
    }
    while (text.length - 1 <= terminal.size.grid.w) {
      text += '-'
    }
    return text
  }
}

module.exports = IO
