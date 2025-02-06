'use strict'

/* global transposeTable */

function Midi (client) {
  this.mode = 0
  this.isClock = false

  this.outputIndex = -1
  this.inputIndex = -1

  this.outputs = []
  this.inputs = []
  this.stack = []

  this.start = function () {
    console.info('Midi Starting..')
    this.refresh()
  }

  this.clear = function () {
    this.stack = this.stack.filter((item) => { return item })
  }

  this.run = function () {
    for (const id in this.stack) {
      const item = this.stack[id]
      if (item.isPlayed === false) {
        this.press(item)
      }
      if (item.length < 1) {
        this.release(item, id)
      } else {
        item.length--
      }
    }
  }

  this.trigger = function (item, down) {
    if (!this.outputDevice()) { console.warn('MIDI', 'No midi output!'); return }

    const transposed = this.transpose(item.note, item.octave)
    const rawChannel = !isNaN(item.channel) ? parseInt(item.channel) : client.orca.valueOf(item.channel)
    const deviceOffset = Math.floor(rawChannel / 16)
    const channel = rawChannel % 16

    if (!transposed) { return }

    const c = down === true ? 0x90 + channel : 0x80 + channel
    const n = transposed.id
    const v = parseInt((item.velocity / 16) * 127)

    if (!n || c === 127) { return }

    if (this.outputIndex + deviceOffset < this.outputs.length) {
      this.outputs[this.outputIndex + deviceOffset].send([c, n, v])
    }
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
    for (const item of this.stack) {
      this.release(item)
    }
  }

  this.push = function (channel, octave, note, velocity, length, isPlayed = false) {
    const item = { channel, octave, note, velocity, length, isPlayed }
    // Retrigger duplicates
    for (const id in this.stack) {
      const dup = this.stack[id]
      if (dup.channel === channel && dup.octave === octave && dup.note === note) { this.release(item, id) }
    }
    this.stack.push(item)
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

  this.sendClockStart = function () {
    if (!this.outputDevice()) { return }
    this.isClock = true
    this.outputDevice().send([0xFA], 0)
    console.log('MIDI', 'MIDI Start Sent')
  }

  this.sendClockStop = function () {
    if (!this.outputDevice()) { return }
    this.isClock = false
    this.outputDevice().send([0xFC], 0)
    console.log('MIDI', 'MIDI Stop Sent')
  }

  this.sendClock = function () {
    if (!this.outputDevice()) { return }
    if (this.isClock !== true) { return }

    const bpm = client.clock.speed.value
    const frameTime = (60000 / bpm) / 4
    const frameFrag = frameTime / 6

    for (let id = 0; id < 6; id++) {
      if (this.ticks[id]) { clearTimeout(this.ticks[id]) }
      this.ticks[id] = setTimeout(() => { this.outputDevice().send([0xF8], 0) }, parseInt(id) * frameFrag)
    }
  }

  this.receive = function (msg) {
    switch (msg.data[0]) {
      // Clock
      case 0xF8:
        client.clock.tap()
        break
      case 0xFA:
        console.log('MIDI', 'Start Received')
        client.clock.play(false, true)
        break
      case 0xFB:
        console.log('MIDI', 'Continue Received')
        client.clock.play()
        break
      case 0xFC:
        console.log('MIDI', 'Stop Received')
        client.clock.stop()
        break
    }
  }

  // Tools

  this.selectOutput = function (id) {
    if (id === -1) { this.outputIndex = -1; console.log('MIDI', 'Select Output Device: None'); return }
    if (!this.outputs[id]) { console.warn('MIDI', `Unknown device with id ${id}`); return }

    this.outputIndex = parseInt(id)
    console.log('MIDI', `Select Output Device: ${this.outputDevice().name}`)
  }

  this.selectInput = function (id) {
    if (this.inputDevice()) { this.inputDevice().onmidimessage = null }
    if (id === -1) { this.inputIndex = -1; console.log('MIDI', 'Select Input Device: None'); return }
    if (!this.inputs[id]) { console.warn('MIDI', `Unknown device with id ${id}`); return }

    this.inputIndex = parseInt(id)
    this.inputDevice().onmidimessage = (msg) => { this.receive(msg) }
    console.log('MIDI', `Select Input Device: ${this.inputDevice().name}`)
  }

  this.setDeviceByName = function(paramStr) {
    // find devices by name and move them to the desired slot
    const parts = paramStr.match(/([io])(\d+)-(.*)/)
    console.log(parts)
    if (!parts || parts.length !== 4 || parts[3] === "") { return }
    const index = parseInt(parts[2])
    const nameStr = parts[3]

    const fuzzy = function(term, s) {
      var string = s.toLowerCase();
      var compare = term.toLowerCase();
      var matches = 0;
      if (string.indexOf(compare) > -1) return 1; // covers basic partial matches
      for (var i = 0; i < compare.length; i++) {
          string.indexOf(compare[i]) > -1 ? matches += 1 : matches -=1;
      }
      return matches/s.length
  };

    const findDevice = function(arr, s) {
      const scores = arr.map((x, i) => Object.assign({}, {
        score: fuzzy(s, x.name), name: x.name, index: i
      })).filter(x => x.score > 0.1).sort((a,b) => b.score - a.score)
      console.log('scores', scores)

      if (scores.length > 0) {
        console.log('Device matched', scores[0])
        return scores[0].index
      }
      return -1
    }

    const move = function(arr, from, to) {
      arr.splice(to, 0, arr.splice(from, 1)[0])
    }

    if (parts[1] === 'i') {
      console.log('inputs before', this.inputs.map(x => x.name))
      if (index >= this.inputs.length) { return }
      const foundIndex = findDevice(this.inputs, nameStr)
      if (foundIndex >= 0) { move(this.inputs, foundIndex, index) }
      console.log('inputs after', this.inputs.map(x => x.name))
    } else {
      console.log('outputs before', this.outputs.map(x => x.name))
      if (index >= this.outputs.length) { return }
      const foundIndex = findDevice(this.outputs, nameStr)
      if (foundIndex >= 0) { move(this.outputs, foundIndex, index) }
      console.log('outputs after', this.outputs.map(x => x.name))
    }
    client.update()
  }

  this.outputDevice = function () {
    return this.outputs[this.outputIndex]
  }

  this.inputDevice = function () {
    return this.inputs[this.inputIndex]
  }

  this.selectNextOutput = () => {
    this.outputIndex = this.outputIndex < this.outputs.length ? this.outputIndex + 1 : 0
    client.update()
  }

  this.selectNextInput = () => {
    const id = this.inputIndex < this.inputs.length - 1 ? this.inputIndex + 1 : -1
    this.selectInput(id)
    client.update()
  }

  // Setup

  this.refresh = function () {
    if (!navigator.requestMIDIAccess) { return }
    navigator.requestMIDIAccess().then(this.access, (err) => {
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
    if (!transposeTable[n]) { return null }
    const octave = clamp(parseInt(o) + parseInt(transposeTable[n].charAt(1)), 0, 8)
    const note = transposeTable[n].charAt(0)
    const value = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'].indexOf(note)
    const id = clamp((octave * 12) + value + 24, 0, 127)
    return { id, value, note, octave }
  }

  this.convert = function (id) {
    const note = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'][id % 12]
    const octave = Math.floor(id / 12) - 5
    const name = `${note}${octave}`
    const key = Object.values(transposeTable).indexOf(name)
    return Object.keys(transposeTable)[key]
  }

  this.toString = function () {
    return !navigator.requestMIDIAccess ? 'No Midi Support' : this.outputDevice() ? `${this.outputDevice().name}` : 'No Midi Device'
  }

  this.toInputString = () => {
    return !navigator.requestMIDIAccess ? 'No Midi Support' : this.inputDevice() ? `${this.inputIndex}:${this.inputDevice().name}` : 'No Input Device'
  }

  this.toOutputString = () => {
    return !navigator.requestMIDIAccess ? 'No Midi Support' : this.outputDevice() ? `${this.outputIndex}:${this.outputDevice().name}` : 'No Output Device'
  }

  this.length = function () {
    return this.stack.length
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
