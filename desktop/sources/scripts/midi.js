'use strict'

function Midi (terminal) {
  this.terminal = terminal
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

    let html = ''
    for (const id in this.stack) {
      const note = this.stack[id]
      html += `Ch${note[0]}:${note[1]}+${note[2]}(${note[3]}) `
    }
    terminal.log(`${html}`)
  }

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

  this.send = function (channel, octave, note, velocity) {
    this.stack.push([channel, octave, note, velocity])
  }

  this.play = function () {
    this.ch1()
    this.ch3()
  }

  this.ch1 = function () {
    terminal.midi.outputs[0].send([0x90, 60, 127])
    terminal.midi.outputs[0].send([0x80, 60, 127], window.performance.now() + 250.0)
  }

  this.ch3 = function () {
    terminal.midi.outputs[0].send([0x92, 60, 127])
    terminal.midi.outputs[0].send([0x82, 60, 127], window.performance.now() + 250.0)
  }

  this.vu = function () {
    if (this.stack.length === 0) { return '------' }
    if (this.stack.length === 1) { return '|-----' }
    if (this.stack.length === 2) { return '||----' }
    if (this.stack.length === 3) { return '|||---' }
    if (this.stack.length === 4) { return '||||--' }
    if (this.stack.length === 5) { return '|||||-' }
    if (this.stack.length > 4) { return '||||||' }
  }
}

module.exports = Midi
