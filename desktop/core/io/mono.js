'use strict'

export default function Mono (terminal) {
  this.queue = null
  this.stack = []

  this.start = function () {
    console.info('Mono Starting..')
  }

  this.run = function () {
    if (this.stack[0]) {
      if (this.stack[0].length <= 1) {
        this.release()
      } else {
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
    this.trigger(item, true)
    this.stack[0] = item
    this.queue = null
  }

  this.release = function (item = this.stack[0]) {
    if (!item) { return }
    this.trigger(this.stack[0], false)
    this.stack = []
  }

  this.clear = function () {

  }

  this.trigger = function (item, down) {
    if (!terminal.io.midi.outputDevice()) { console.warn('Mono', 'No midi output!'); return }
    if (!item) { return }

    const channel = down === true ? 0x90 + item.channel : 0x80 + item.channel
    const note = clamp(24 + (item.octave * 12) + item.note, 0, 127)
    const velocity = clamp(item.velocity, 0, 127)

    terminal.io.midi.outputDevice().send([channel, note, velocity])
  }

  this.send = function (channel, octave, note, velocity, length) {
    this.queue = { channel, octave, note, velocity, length }
  }

  this.silence = function () {
    this.release()
  }

  // UI

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
