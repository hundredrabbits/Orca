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

  this.run = function () {
    const device = this.device()
    this.stack = this.stack.filter((item) => {
      const alive = item[4] > 0
      const played = item[5]
      if (alive !== true) {
        this.trigger(item, device, false)
      } else if (played !== true) {
        this.trigger(item, device, true)
      }
      item[4]--
      return alive
    })
  }

  this.trigger = function (item, device, down) {
    if (!device) { console.warn('No midi device!'); return }

    const channel = down === true ? 0x90 + item[0] : 0x80 + item[0]
    const note = 24 + (item[1] * 12) + item[2]
    const velocity = item[3]

    device.send([channel, note, velocity])
    item[5] = true
  }

  this.silence = function () {
    const device = this.device()
    this.stack = this.stack.filter((item) => {
      this.trigger(item, device, false)
      return false
    })
  }

  this.update = function () {
    terminal.controller.clearCat('default', 'Midi')
    terminal.controller.add('default', 'Midi', `Refresh Device List`, () => { terminal.io.midi.setup(); terminal.io.midi.update() }, 'CmdOrCtrl+Shift+Alt+M')
    const devices = terminal.io.midi.list()
    if (devices.length < 1) {
      terminal.controller.add('default', 'Midi', `No Device Available`)
    }
    if (devices.length > 1) {
      terminal.controller.add('default', 'Midi', `Next Device`, () => { terminal.io.midi.next(id) }, 'CmdOrCtrl+Shift+M')
    }
    for (const id in devices) {
      terminal.controller.add('default', 'Midi', `${devices[id].name} ${terminal.io.midi.index === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.midi.select(id) }, '')
    }
    terminal.controller.commit()
  }

  // Tools

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
    this.devices = []
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

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Midi
