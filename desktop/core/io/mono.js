'use strict'

function Mono (terminal) {
  this.queue = null
  this.stack = []

  this.start = function () {
    console.info('Mono Starting..')
  }

  this.run = function () {
    if (this.stack[0]) {
      if (this.stack[0].length < 1) {
        this.release(this.stack[0])
      } else {
        console.log('life', this.stack[0].length)
        this.stack[0].length--
      }
    }

    if (this.queue) {
      this.press()
    }
  }

  this.press = function (item = this.queue) {
    if (!item) { return }
    if (this.stack[0]) { this.release() }
    console.log('press', item)
    this.trigger(item, true)
    this.stack[0] = item
    this.queue = null
  }

  this.release = function (item = this.stack[0]) {
    if (!item) { return }
    console.log('release', item)
    this.trigger(this.stack[0], false)
    this.stack[0] = null
  }

  this.clear = function () {

  }

  this.trigger = function (item, down) {
    if (!terminal.io.midi.outputDevice()) { console.warn('Mono', 'No midi output!'); return }
    if (!item) { return }

    const channel = down === true ? 0x90 + item.channel : 0x80 + item.channel
    const note = clamp(24 + (item.octave * 12) + item.note, 0, 127)

    terminal.io.midi.outputDevice().send([channel, note, 127])
  }

  this.send = function (channel, octave, note, length) {
    this.queue = { channel, octave, note, length }
  }

  this.silence = function () {
    this.release()
  }

  // UI

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Mono
