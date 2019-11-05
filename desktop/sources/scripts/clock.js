'use strict'

/* global Blob */

function Clock (terminal) {
  const worker = 'onmessage = (e) => { setInterval(() => { postMessage(true) }, e.data)}'

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
    this.setSpeed(this.speed.value + (this.speed.value < this.speed.target ? 1 : -1), null, true)
  }

  this.setSpeed = function (value, target = null, setTimer = false) {
    console.info('Clock', 'set', value)
    if (value) { this.speed.value = clamp(value, 60, 300) }
    if (target) { this.speed.target = clamp(target, 60, 300) }
    if (setTimer === true) { this.setTimer(this.speed.value) }
  }

  this.modSpeed = function (mod = 0, animate = false) {
    if (animate === true) {
      this.setSpeed(null, this.speed.target + mod)
    } else {
      this.setSpeed(this.speed.value + mod, this.speed.value + mod, true)
      terminal.update()
    }
  }

  // Controls

  this.togglePlay = function (msg = false) {
    if (this.isPaused === true) {
      this.play(msg)
    } else {
      this.stop(msg)
    }
  }

  this.play = function (msg = false) {
    console.log('Clock', 'Play')
    if (this.isPaused === false) { return }
    if (this.isPuppet === true) { console.warn('Clock', 'External Midi control'); return }
    this.isPaused = false
    if (msg === true) { terminal.io.midi.sendClockStart() }
    this.setSpeed(this.speed.target, this.speed.target, true)
  }

  this.stop = function (msg = false) {
    console.log('Clock', 'Stop')
    if (this.isPaused === true) { console.warn('Clock', 'Already stopped'); return }
    if (this.isPuppet === true) { console.warn('Clock', 'External Midi control'); return }
    this.isPaused = true
    if (msg === true) { terminal.io.midi.sendClockStop() }
    terminal.io.midi.allNotesOff()
    this.clearTimer()
    terminal.io.midi.silence()
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
    this.timer = new Worker(window.URL.createObjectURL(new Blob([worker], { type: 'text/javascript' })))
    this.timer.postMessage((60000 / bpm) / 4)
    this.timer.onmessage = (event) => {
      terminal.io.midi.sendClock()
      terminal.run()
    }
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
    const _message = this.isPuppet === true ? 'midi' : `${this.speed.value}${_offset}`
    const _beat = diff === 0 && terminal.orca.f % 4 === 0 ? '*' : ''
    return `${_message}${_beat}`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
