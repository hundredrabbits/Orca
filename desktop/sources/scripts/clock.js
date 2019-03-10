'use strict'
const MidiClock = require('midi-clock')

class Clock {
  constructor (bpm, callback) {
    this.bpm = 0
    this.callback = () => {}
    this.ppqmCallback = () => {}
    const audioContext = new window.AudioContext()
    this.clock = MidiClock(audioContext)
    this.clock.on('position', position => {
      // log on each beat, ignore the rest
      this.ppqmCallback()
      let microPosition = position % 24
      if (microPosition === 0) this.callback()
    })
    this.setBpm(bpm)
  }

  setCallback (callback) {
    this.callback = callback
  }

  setPpqmCallback (callback) {
    this.ppqmCallback = callback
  }

  canSetBpm () {
    return true
  }

  getBpm () {
    return this.bpm
  }

  setBpm (bpm) {
    this.bpm = bpm
    this.clock.setTempo(this.bpm)
  }

  setRunning (running) {
    if (running) this.clock.start()
    else this.clock.stop()
  }

  start () {
    this.clock.start()
  }

  stop () {
    this.clock.stop()
  }

  toString () {
    return `${this.bpm}`
  }
}

module.exports = Clock
