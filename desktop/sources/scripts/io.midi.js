'use strict'

const MidiClock = require('./io.midi.clock')

function Midi (terminal) {
  this.index = 0
  this.devices = []
  this.stack = []
  this.clock = new MidiClock(terminal)

  this.start = function () {
    console.info('Midi Starting..')
    this.setup()
    this.clock.start()
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
    return [0x90 + id, 0x80 + id]
  }

  function convertNote (octave, note) {
    return 24 + (octave * 12) + note // 60 = C3
  }

  function convertLength (val, bpm) {
    // TODO get bpm from daw midi
    if (!bpm) {
      bpm = 120
    }
    return (60000 / bpm) * (val / 15)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Midi
