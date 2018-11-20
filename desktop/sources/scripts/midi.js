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

    let text = ''
    for (const id in this.stack) {
      const note = this.stack[id]
      text += `${note[0]}+${note[1]}|${note[2]}.${note[3]}-.${note[4]} `
      this.play(note)
    }

    terminal.log(text)
  }

  this.send = function (channel, octave, note, velocity) {
    this.stack.push([channel, octave, note, velocity])
  }

  this.play = function (note) {
    const channel = this.makeChannel(note[0])
    const value = this.makeValue(note[1], note[2])
    const velocity = note[3]

    this.playNote(channel, value, velocity)
  }

  this.playNote = function (channel, value, velocity) {
    // TODO: Fix length to terminal bpm
    const length = window.performance.now() + 100.0

    terminal.midi.outputs[0].send([channel[0], value, velocity])
    terminal.midi.outputs[0].send([channel[1], value, velocity], length)
  }

  //

  this.makeChannel = function (id) {
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

  this.makeValue = function (octave, note) {
    const offset = 24
    const value = offset + (octave * 12) + note
    return value // 60 = C3
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
    while (text.length - 1 <= terminal.grid.x) {
      text += '-'
    }
    return text
  }
}

module.exports = Midi
