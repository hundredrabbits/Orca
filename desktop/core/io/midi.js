'use strict'

function Midi (terminal) {
  this.mode = 0

  this.outputIndex = -1
  this.inputIndex = -1

  this.outputs = []
  this.inputs = []
  this.stack = []

  this.start = function () {
    console.info('Midi Starting..')
    this.setup()
  }

  this.clear = function () {

  }

  this.update = function () {
    terminal.controller.clearCat('default', 'Midi')
    terminal.controller.add('default', 'Midi', `Refresh Device List`, () => { terminal.io.midi.setup(); terminal.io.midi.update() })
    terminal.controller.addSpacer('default', 'Midi', 'spacer1')

    // Outputs
    if (this.outputs.length < 1) {
      terminal.controller.add('default', 'Midi', `No Midi Outputs`)
    } else {
      for (const id in this.outputs) {
        terminal.controller.add('default', 'Midi', `${this.outputs[id].name} ${terminal.io.midi.outputIndex === parseInt(id) ? ' — Output' : ''}`, () => { terminal.io.midi.selectOutput(id) }, '')
      }
      terminal.controller.add('default', 'Midi', `No Output ${terminal.io.midi.outputIndex === -1 ? ' — Output' : ''}`, () => { terminal.io.midi.selectOutput(-1) }, '')
      terminal.controller.addSpacer('default', 'Midi', 'spacer2')
    }

    // Inputs
    if (this.inputs.length < 1) {
      terminal.controller.add('default', 'Midi', `No Midi Inputs`)
    } else {
      for (const id in this.inputs) {
        terminal.controller.add('default', 'Midi', `${this.inputs[id].name} ${terminal.io.midi.inputIndex === parseInt(id) ? ' — Input' : ''}`, () => { terminal.io.midi.selectInput(id) }, '')
      }
      terminal.controller.add('default', 'Midi', `No Input ${terminal.io.midi.inputIndex === -1 ? ' — Input' : ''}`, () => { terminal.io.midi.selectInput(-1) }, '')
    }

    terminal.controller.commit()
  }

  this.run = function () {
    this.stack = this.stack.filter((item) => {
      const alive = item[4] > 0
      const played = item[5]
      if (alive !== true) {
        this.trigger(item, false)
      } else if (played !== true) {
        this.trigger(item, true)
      }
      item[4]--
      return alive
    })
  }

  this.trigger = function (item, down) {
    if (!this.outputDevice()) { console.warn('Midi', 'No midi output!'); return }

    const channel = down === true ? 0x90 + item[0] : 0x80 + item[0]
    const note = 24 + (item[1] * 12) + item[2]
    const velocity = item[3]

    this.outputDevice().send([channel, note, velocity])
    item[5] = true
  }

  this.send = function (channel, octave, note, velocity, length, played = false) {
    for (const id in this.stack) {
      const item = this.stack[id]
      if (item[0] === channel && item[1] === octave && item[2] === note) {
        item[3] = velocity
        item[4] = length
        item[5] = played
        return
      }
    }
    this.stack.push([channel, octave, note, velocity, length, played])
  }

  this.silence = function () {
    this.stack = this.stack.filter((item) => {
      this.trigger(item, false)
      return false
    })
  }

  // Clock

  this.ticks = []
  // TODO
  this.sendClock = function () {
    if (!this.outputDevice()) { return }
    if (this.sendClock !== true) { return }

    const bpm = terminal.clock.speed.value
    const frameTime = (60000 / bpm) / 4
    const frameFrag = frameTime / 6

    for (let id = 0; id < 6; id++) {
      if (this.ticks[id]) { clearTimeout(this.ticks[id]) }
      this.ticks[id] = setTimeout(() => { this.outputDevice().send([0xF8], 0) }, parseInt(id) * frameFrag)
    }
  }

  this.count = 0

  this.receive = function (msg) {
    switch (msg.data[0]) {
      case 0xF8:
        this.count = (this.count + 1) % 6
        if (this.count % 4 === 0) {
          terminal.clock.tap()
        }
        break
      case 0xFA:
        console.log('Midi', 'Clock start.')
        terminal.clock.play()
        break
      case 0xFC:
        console.log('Midi', 'Clock stop.')
        terminal.clock.stop()
        break
    }
  }

  // Tools

  this.selectOutput = function (id) {
    if (id === -1) { this.outputIndex = -1; this.update(); return }
    if (!this.outputs[id]) { return }

    this.outputIndex = parseInt(id)
    console.log('Midi', `Output Device: ${this.outputDevice().name}`)
    this.update()
  }

  this.selectInput = function (id) {
    if (this.inputDevice()) { this.inputDevice().onmidimessage = null }
    if (id === -1) { this.inputIndex = -1; this.update(); return }
    if (!this.inputs[id]) { return }

    this.inputIndex = parseInt(id)
    this.inputDevice().onmidimessage = (msg) => { this.receive(msg) }
    console.log('Midi', `Input Device: ${this.inputDevice().name}`)
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
    this.outputs = []
    navigator.requestMIDIAccess({ sysex: false }).then(this.access, (err) => {
      console.warn('No Midi', err)
    })
  }

  this.access = function (midiAccess) {
    const outputs = midiAccess.outputs.values()
    for (let i = outputs.next(); i && !i.done; i = outputs.next()) {
      terminal.io.midi.outputs.push(i.value)
    }
    terminal.io.midi.selectOutput(0)

    const inputs = midiAccess.inputs.values()
    for (let i = inputs.next(); i && !i.done; i = inputs.next()) {
      terminal.io.midi.inputs.push(i.value)
    }
    terminal.io.midi.selectInput(-1)
  }

  // UI

  this.toString = function () {
    return this.outputDevice() ? `${this.outputDevice().name}` : 'No Midi'
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Midi
