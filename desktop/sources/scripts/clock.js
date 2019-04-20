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
    // Animate
    if (this.speed.target !== this.speed.value) {
      this.set(this.speed.value + (this.speed.value < this.speed.target ? 1 : -1), null, true)
    }
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
    // If in insert mode, insert space
    if (terminal.cursor.mode === 1) {
      terminal.cursor.move(1, 0)
      return
    }
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
    this.set(this.speed.target, this.speed.target, true)
  }

  this.stop = function () {
    if (this.isPaused) { console.warn('Already stopped'); return }
    console.log('Clock', 'Stop')
    terminal.io.midi.silence()
    this.isPaused = true
    this.clearTimer()
  }

  // Midi Tap

  this.intervals = []
  this.lastTap = 0

  this.tap = function () {
    if (this.intervals.length > 8) {
      this.intervals.shift()
    }
    if (this.intervals.length === 8) {
      const sum = this.intervals.reduce((sum, interval) => { return sum + interval })
      const bpm = parseInt((1000 / sum) * 60)
      if (Math.abs(bpm - this.speed.target) > 1) {
        this.set(null, bpm)
      }
    }

    const now = performance.now()
    this.intervals.push(now - this.lastTap)
    this.lastTap = now
  }

  // Timer

  this.clearTimer = function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  this.setTimer = function (bpm) {
    console.log('Clock', `Setting new ${bpm} timer..`)
    this.clearTimer()
    this.timer = setInterval(() => { terminal.run(); this.update() }, (60000 / bpm) / 4)
  }

  this.resetFrame = function () {
    terminal.orca.f = 0
  }

  this.setFrame = function (f) {
    if (isNaN(f)) { return }
    terminal.orca.f = clamp(f, 0, 9999999)
  }

  // UI

  this.toString = function () {
    const diff = this.speed.target - this.speed.value
    const _offset = Math.abs(diff) > 5 ? (diff > 0 ? `+${diff}` : diff) : ''
    const _beat = diff === 0 && terminal.orca.f % 4 === 0 ? '*' : ''
    return `${this.speed.value}${_offset}${_beat}`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Clock
