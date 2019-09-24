'use strict'

import transpose from '../transpose.js'

export default function Midi (terminal) {
  this.mode = 0
  this.isClock = false

  this.outputIndex = -1
  this.inputIndex = -1

  this.outputs = []
  this.inputs = []
  this.stack = []

  this.keys = {}

  this.start = function () {
    console.info('Midi Starting..')
    this.setup()
  }

  this.clear = function () {
    this.stack = this.stack.filter((item) => { return item })
  }

  this.run = function () {
    for (const id in this.stack) {
      if (this.stack[id].length < 1) {
        this.release(this.stack[id], id)
      }
      if (!this.stack[id]) { continue }
      if (this.stack[id].isPlayed === false) {
        this.press(this.stack[id])
      }
      this.stack[id].length--
    }
  }

  this.trigger = function (item, down) {
    if (!this.outputDevice()) { console.warn('MIDI', 'No midi output!'); return }

    const transposed = this.transpose(item.note, item.octave)
    const channel = !isNaN(item.channel) ? parseInt(item.channel) : terminal.orca.valueOf(item.channel)

    if (!transposed) { return }

    const c = down === true ? 0x90 + channel : 0x80 + channel
    const n = transposed.id
    const v = parseInt((item.velocity / 16) * 127)

    if (!n || c === 127) { return }

    this.outputDevice().send([c, n, v])
  }

  this.press = function (item) {
    if (!item) { return }
    this.trigger(item, true)
    item.isPlayed = true
  }

  this.release = function (item, id) {
    if (!item) { return }
    this.trigger(item, false)
    delete this.stack[id]
  }

  this.silence = function () {
    for (const id in this.stack) {
      this.release(this.stack[id])
    }
  }

  this.push = function (channel, octave, note, velocity, length, isPlayed = false) {
    const item = { channel, octave, note, velocity, length, isPlayed }
    // Retrigger duplicates
    for (const id in this.stack) {
      if (this.stack[id].channel === channel && this.stack[id].octave === octave && this.stack[id].note === note) { this.release(item, id) }
    }
    this.stack.push(item)
  }

  this.update = () => {
    terminal.controller.clearCat('default', 'Midi')
    terminal.controller.add('default', 'Midi', `MIDI Send Clock ${this.isClock === true ? ' — On' : ' — Off'}`, () => { this.toggleClock(); this.update() }, '')

    terminal.controller.add('default', 'Midi', `Refresh Device List`, () => { this.setup(); this.update() })
    terminal.controller.addSpacer('default', 'Midi', 'spacer1')

    // Outputs
    if (this.outputs.length < 1) {
      terminal.controller.add('default', 'Midi', `No Midi Outputs`)
    } else {
      for (const id in this.outputs) {
        terminal.controller.add('default', 'Midi', `${this.outputs[id].name} Output ${this.outputIndex === parseInt(id) ? ' — Active' : ''}`, () => { this.selectOutput(id) }, '')
      }
      terminal.controller.add('default', 'Midi', `No Output ${this.outputIndex === -1 ? ' — Active' : ''}`, () => { this.selectOutput(-1) }, '')
      terminal.controller.addSpacer('default', 'Midi', 'spacer2')
    }

    // Inputs
    if (this.inputs.length < 1) {
      terminal.controller.add('default', 'Midi', `No Midi Inputs`)
    } else {
      for (const id in this.inputs) {
        terminal.controller.add('default', 'Midi', `${this.inputs[id].name} Input ${this.inputIndex === parseInt(id) ? ' — Active' : ''}`, () => { this.selectInput(id) }, '')
      }
      terminal.controller.add('default', 'Midi', `No Input ${this.inputIndex === -1 ? ' — Active' : ''}`, () => { this.selectInput(-1) }, '')
    }

    terminal.controller.commit()
  }

  // Keys

  this.keyDown = function (channel, key) {
    this.keys[channel] = key
  }

  this.keyUp = function (channel, key) {
    this.keys[channel] = null
  }

  this.allNotesOff = function () {
  	if (!this.outputDevice()) { return }
  	console.log('MIDI', 'All Notes Off')
  	for (let chan = 0; chan < 16; chan++) {
      this.outputDevice().send([0xB0 + chan, 123, 0])
    }
  }

  // Clock

  this.ticks = []

  this.toggleClock = function () {
    this.isClock = !this.isClock
    terminal.clock.stop()
  }

  this.sendClock = function () {
    if (!this.outputDevice()) { return }
    if (this.isClock !== true) { return }

    const bpm = terminal.clock.speed.value
    const frameTime = (60000 / bpm) / 4
    const frameFrag = frameTime / 6

    for (let id = 0; id < 6; id++) {
      if (this.ticks[id]) { clearTimeout(this.ticks[id]) }
      this.ticks[id] = setTimeout(() => { this.outputDevice().send([0xF8], 0) }, parseInt(id) * frameFrag)
      console.log('MIDI', 'send ticks:')
    }
  }

  this.sendClockStart = function () {
    if (!this.outputDevice()) { return }
    this.outputDevice().send([0xFA], 0)
    console.log('MIDI', 'MIDI Start Sent')
  }

  this.sendClockStop = function () {
    if (!this.outputDevice()) { return }
    this.outputDevice().send([0xFC], 0)
    console.log('MIDI', 'MIDI Stop Sent')
  }

  this.receive = function (msg) {
    // Keys
    if (msg.data[0] >= 144 && msg.data[0] < 160) {
      this.keyDown(msg.data[0] - 144, msg.data[1])
      return
    }
    if (msg.data[0] >= 128 && msg.data[0] < 144) {
      this.keyUp(msg.data[0] - 128, msg.data[1])
      return
    }

    // listen for clock all the time
    // check for clock in?
    if (msg.data[0] === 0xF8) { terminal.clock.tap() }

    switch (msg.data[0]) {
      // Clock
      // case 0xF8:
      //  terminal.clock.tap()
      //  break
      case 0xFA:
        console.log('MIDI', 'Start Received')
        terminal.clock.play()
        break
      case 0xFB:
        console.log('MIDI', 'Continue Received')
        terminal.clock.play()
        break
      case 0xFC:
        console.log('MIDI', 'Stop Received')
        terminal.clock.stop()
        break
    }
  }

  // Tools

  this.selectOutput = function (id) {
    if (id === -1) { this.outputIndex = -1; console.log('MIDI', `Select Output Device: None`); this.update(); return }
    if (!this.outputs[id]) { return }

    this.outputIndex = parseInt(id)
    console.log('MIDI', `Select Output Device: ${this.outputDevice().name}`)
    this.update()
  }

  this.selectInput = function (id) {
    if (this.inputDevice()) { this.inputDevice().onmidimessage = null }
    if (id === -1) { this.inputIndex = -1; console.log('MIDI', `Select Input Device: None`); this.update(); return }
    if (!this.inputs[id]) { return }

    this.inputIndex = parseInt(id)
    this.inputDevice().onmidimessage = (msg) => { this.receive(msg) }
    console.log('MIDI', `Select Input Device: ${this.inputDevice().name}`)
    this.update()
  }

  this.outputDevice = function () {
    return this.outputs[this.outputIndex]
  }

  this.inputDevice = function () {
    return this.inputs[this.inputIndex]
  }

  // Setup

  this.setup = function () {
    if (!navigator.requestMIDIAccess) { return }
    navigator.requestMIDIAccess({ sysex: false }).then(this.access, (err) => {
      console.warn('No Midi', err)
    })
  }

  this.access = (midiAccess) => {
    const outputs = midiAccess.outputs.values()
    this.outputs = []
    for (let i = outputs.next(); i && !i.done; i = outputs.next()) {
      this.outputs.push(i.value)
    }
    this.selectOutput(0)

    const inputs = midiAccess.inputs.values()
    this.inputs = []
    for (let i = inputs.next(); i && !i.done; i = inputs.next()) {
      this.inputs.push(i.value)
    }
    this.selectInput(-1)
  }

  // UI

  this.transpose = function (n, o = 3) {
    if (!transpose[n]) { return null }
    const octave = clamp(parseInt(o) + parseInt(transpose[n].charAt(1)), 0, 8)
    const note = transpose[n].charAt(0)
    const value = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'].indexOf(note)
    const id = clamp((octave * 12) + value + 24, 0, 127)
    return { id, value, note, octave }
  }

  this.convert = function (id) {
    const note = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'][id % 12]
    const octave = Math.floor(id / 12) - 5
    const name = `${note}${octave}`
    const key = Object.values(transpose).indexOf(name)
    return Object.keys(transpose)[key]
  }

  this.toString = function () {
    return this.outputDevice() ? `${this.outputDevice().name}` : 'No Midi'
  }

  this.length = function () {
    return this.stack.length
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
