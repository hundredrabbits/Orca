'use strict'

function QQQ (terminal) {
  this.terminal = terminal
  this.volume = 1
  this.midi = false
  this.outputs = []

  this.start = function () {
    this.midiSetup()
  }

  this.midiSetup = function () {
    if (!navigator.requestMIDIAccess) { return }

    navigator.requestMIDIAccess({ sysex: false }).then(this.midiActive, this.midiInactive)
  }

  this.midiActive = function (midiAccess) {
    const iter = midiAccess.outputs.values()
    for (let i = iter.next(); i && !i.done; i = iter.next()) {
      console.log(terminal.qqq)
      terminal.qqq.outputs.push(i.value)
    }
  }

  this.midiInactive = function (err) {
    console.warn('No Midi')
  }

  this.play = function () {
    this.ch1()
    this.ch3()
  }

  this.ch1 = function () {
    terminal.qqq.outputs[0].send([0x90, 60, 127])
    terminal.qqq.outputs[0].send([0x80, 60, 127], window.performance.now() + 250.0)
  }

  this.ch3 = function () {
    terminal.qqq.outputs[0].send([0x92, 60, 127])
    terminal.qqq.outputs[0].send([0x82, 60, 127], window.performance.now() + 250.0)
  }

  this.setVolume = function (value) {
    this.terminal.log(`Changed volume to ${value}.`)
    this.volume = parseInt(value) / 100.0
  }
}

module.exports = QQQ
