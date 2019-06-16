'use strict'

export default function Clock (terminal) {
  const path = require('path')

  this.isPaused = true
  this.timer = null
  this.isPuppet = false

  this.speed = { value: 120, target: 120 }

  this.start = function () {
    this.setTimer(120)
    this.play()
  }

  this.touch = function () {
    this.stop()
    terminal.run()
  }

  this.run = function () {
    if (this.speed.target === this.speed.value) { return }
    this.set(this.speed.value + (this.speed.value < this.speed.target ? 1 : -1), null, true)
  }

  this.set = function (value, target = null, setTimer = false) {
    if (value) { this.speed.value = clamp(value, 60, 300) }
    if (target) { this.speed.target = clamp(target, 60, 300) }
    if (setTimer === true) { this.setTimer(this.speed.value) }
  }

  this.mod = function (mod = 0, animate = false) {
    if (animate === true) {
      this.set(null, this.speed.target + mod)
    } else {
      this.set(this.speed.value + mod, this.speed.value + mod, true)
      terminal.update()
    }
  }

  // Controls

  this.togglePlay = function () {
    if (this.isPaused === true) {
      this.play()
    } else {
      this.stop()
    }
  }

  this.play = function () {
    if (!this.isPaused) { console.warn('Already playing'); return }
    console.log('Clock', 'Play')
    this.isPaused = false
    if (this.isPuppet) { return console.warn('External Midi control') }
    this.set(this.speed.target, this.speed.target, true)
  }

  this.stop = function () {
    if (this.isPaused) { console.warn('Already stopped'); return }
    console.log('Clock', 'Stop')
    terminal.io.midi.silence()
    this.isPaused = true
    if (this.isPuppet) { return console.warn('External Midi control') }
    this.clearTimer()
  }

  // External Clock

  const pulse = { count: 0, last: null, timer: null }

  this.tap = function () {
    pulse.last = performance.now()
    if (!this.isPuppet) {
      console.log('Clock', 'Puppeteering starts..')
      this.isPuppet = true
      this.clearTimer()
      pulse.timer = setInterval(() => {
        if (performance.now() - pulse.last < 2000) { return }
        this.untap()
      }, 2000)
    }
    if (this.isPaused) { return }
    pulse.count = pulse.count + 1
    if (pulse.count % 6 === 0) {
      terminal.run()
      pulse.count = 0
    }
  }

  this.untap = function () {
    console.log('Clock', 'Puppeteering stops..')
    clearInterval(pulse.timer)
    this.isPuppet = false
    pulse.count = 1
    pulse.last = null
    this.setTimer(this.speed.value)
  }

  // Timer

  this.setTimer = function (bpm) {
    console.log('Clock', 'New Timer ' + bpm + 'bpm')
    this.clearTimer()
    this.timer = new Worker(`${__dirname}/scripts/timer.js`)
    this.timer.postMessage((60000 / bpm) / 4)
    this.timer.onmessage = (event) => { terminal.run() }
  }

  this.clearTimer = function () {
    if (this.timer) {
      this.timer.terminate()
    }
    this.timer = null
  }

  this.setFrame = function (f) {
    if (isNaN(f)) { return }
    terminal.orca.f = clamp(f, 0, 9999999)
  }

  this.resetFrame = function () {
    terminal.orca.f = 0
  }

  // UI

  this.toString = function () {
    const diff = this.speed.target - this.speed.value
    const _offset = Math.abs(diff) > 5 ? (diff > 0 ? `+${diff}` : diff) : ''
    const _message = this.isPuppet ? 'midi' : `${this.speed.value}${_offset}`
    const _beat = diff === 0 && terminal.orca.f % 4 === 0 ? '*' : ''
    return `${_message}${_beat}`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
