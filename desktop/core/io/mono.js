'use strict'

function Mono (terminal) {
  this.stack = []

  this.start = function () {
    console.info('Mono Starting..')
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

  this.clear = function () {

  }

  this.trigger = function (item, down) {
    if (!terminal.io.midi.outputDevice()) { console.warn('Mono', 'No midi output!'); return }

    const channel = down === true ? 0x90 : 0x80
    const note = clamp(24 + (item[1] * 12) + item[2], 0, 127)

    console.log(down, item)
    // this.outputDevice().send([channel, note, velocity])
    item[5] = true
  }

  this.send = function (octave, note, length, played = false) {
    for (const id in this.stack) {
      const item = this.stack[id]
    }
    this.stack.push([octave, note, length, played])
  }

  this.silence = function () {
    this.stack = this.stack.filter((item) => {
      this.trigger(item, false)
      return false
    })
  }

  // UI

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Mono
