'use strict'

function Clock (terminal) {
  this.isPaused = true
  this.timer = null

  this.speed = { value: 120, target: 120 }

  this.start = function () {
    this.setTimer(120)
    this.play()
  }

  this.update = function () {
    this.animate()
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

  this.animate = function () {
    if (this.speed.target === this.speed.value) { return }
    this.set(this.speed.value + (this.speed.value < this.speed.target ? 1 : -1), null, true)
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
    console.log('Play')
    this.isPaused = false
    this.set(this.speed.target, this.speed.target, true)
  }

  this.stop = function () {
    if (this.isPaused) { console.warn('Already stopped'); return }
    console.log('Stop')
    terminal.io.midi.silence()
    this.isPaused = true
    this.clearTimer()
  }

  // Timer

  this.clearTimer = function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  this.setTimer = function (bpm) {
    this.clearTimer()
    this.timer = setInterval(() => { terminal.run(); this.update() }, (60000 / bpm) / 4)
  }

  this.resetFrame = function () {
    terminal.orca.f = 0
  }

  // UI

  this.toString = function () {
    const diff = this.speed.target - this.speed.value
    const _offset = diff > 0 ? `+${diff}` : diff < 0 ? diff : ''
    const _beat = diff === 0 && terminal.orca.f % 4 === 0 ? '*' : ''
    return `${this.speed.value}${_offset}${_beat}`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Clock
