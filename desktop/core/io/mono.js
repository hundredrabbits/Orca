'use strict'

export default function Mono (terminal) {
  this.stack = {}

  this.start = function () {
    console.info('MidiMono Starting..')
  }

  this.clear = function () {

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

  this.press = function (item) {
    if (!item) { return }
    terminal.io.midi.trigger(item, true)
    item.isPlayed = true
  }

  this.release = function (item) {
    if (!item) { return }
    terminal.io.midi.trigger(item, false)
    delete this.stack[item.channel]
  }

  this.silence = function () {
    for (const id in this.stack) {
      this.release(this.stack[id])
    }
  }

  this.send = function (channel, octave, note, velocity, length, isPlayed = false) {
    if (this.stack[channel]) {
      this.release(this.stack[channel])
    }
    this.stack[channel] = { channel, octave, note, velocity, length, isPlayed }
  }

  this.length = function () {
    return Object.keys(this.stack).length
  }
}
