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
    if (this.speed.target === this.speed.value) { return }

    this.setTimer(this.speed.value)

    if (this.speed.value < this.speed.target) { this.speed.value++ }
    if (this.speed.value > this.speed.target) { this.speed.value-- }
  }

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
    this.setTimer(this.speed.target)
  }

  this.stop = function () {
    if (this.isPaused) { console.warn('Already stopped'); return }
    console.log('Stop')
    terminal.io.midi.silence()
    this.isPaused = true
    this.clearTimer()
  }

  this.clearTimer = function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  this.setTimer = function (bpm) {
    this.speed.value = bpm
    this.clearTimer()
    this.timer = setInterval(() => { terminal.run(); this.update() }, (60000 / bpm) / 4)
  }

  this.setSpeed = function (bpm, animate = false) {
    if (animate) {
      this.speed.target = bpm
    } else {
      this.setTimer(bpm)
    }
  }

  this.modSpeed = function (mod = 0, animate = false) {
    if (animate === true) {
      this.speed.target += mod
    } else {
      this.setTimer(this.speed.value + mod)
      this.speed.target = this.speed.value
      terminal.update()
    }
  }

  this.resetFrame = function () {
    terminal.orca.f = 0
  }

  this.toString = function () {
    const diff = this.speed.target - this.speed.value
    const _offset = diff > 0 ? `+${diff}` : diff < 0 ? diff : ''
    const _beat = diff === 0 && terminal.orca.f % 4 === 0 ? '*' : ''
    return `${this.speed.value}${_offset}${_beat}`
  }
}

module.exports = Clock
