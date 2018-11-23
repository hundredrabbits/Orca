'use strict'

function Midi (terminal) {
  this.outputs = []
  this.stack = []

  this.start = function () {
    this.midiSetup()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    if (this.stack.length < 1) { return }

    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (channel, octave, note, velocity, length) {
    this.stack.push([channel, octave, note, velocity, length])
  }

  this.play = function (data) {
    const channel = convertChannel(data[0])
    const note = convertNote(data[1], data[2])
    const velocity = data[3]
    const length = window.performance.now() + convertLength(data[4], terminal.bpm)

    terminal.midi.outputs[0].send([channel[0], note, velocity])
    terminal.midi.outputs[0].send([channel[1], note, velocity], length)
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
      terminal.midi.outputs.push(i.value)
    }
    terminal.log(`Midi is active, devices: ${terminal.midi.outputs.length}`)
  }

  this.midiInactive = function (err) {
    console.warn('No Midi', err)
  }

  this.toString = function () {
    let text = ''
    for (let i = 0; i < this.stack.length; i++) {
      text += '|'
    }
    while (text.length - 1 <= terminal.size.grid.w) {
      text += '-'
    }
    return text
  }
}

module.exports = Midi
