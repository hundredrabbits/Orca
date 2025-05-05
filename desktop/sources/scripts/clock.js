'use strict'

/* global Blob */

function Clock (client) {
  const workerScript = 'var state = { grooves: [1], period: 60000 * 120 / 4}; function rotateArray(arr, k) {return arr.slice(k).concat(arr.slice(0, k));} function tickFn() { setTimeout(tickFn, state.period * state.grooves[0]); state.grooves = rotateArray(state.grooves, 1); postMessage(true); } onmessage = (e) => { state.grooves = e.data.grooves || state.grooves; state.period = e.data.period || state.period; if (e.data.startTimer) { tickFn(); }}'
  const worker = window.URL.createObjectURL(new Blob([workerScript], { type: 'text/javascript' }))

  this.isPaused = true
  this.timer = null
  this.isPuppet = false

  this.speed = { value: 120, target: 120 }
  this.grooves = [1]
  // TODO add setBeatDivisions method, update code where 4 divisions is used
  this.beatDivisions = 4

  this.start = function () {
    const memoryBPM = parseInt(window.localStorage.getItem('bpm'))
    const memoryGrooves = JSON.parse(window.localStorage.getItem('grooves')) || [1]
    const target = memoryBPM >= 60 ? memoryBPM : 120
    this.setSpeed(target, target, true)
    this.setGroove(memoryGrooves)
    this.play()
  }

  this.touch = function () {
    this.stop()
    client.run()
  }

  this.run = function () {
    if (this.speed.target === this.speed.value) { return }
    this.setSpeed(this.speed.value + (this.speed.value < this.speed.target ? 1 : -1), null, true)
  }

  this.setSpeed = (value, target = null, setTimer = false) => {
    if (this.speed.value === value && this.speed.target === target && this.timer) { return }
    if (value) { this.speed.value = clamp(value, 60, 300) }
    if (target) { this.speed.target = clamp(target, 60, 300) }
    if (this.timer) { // Update an existing clock, if running
      this.sendSpeed(this.speed.value)
    } else { // Start clock if setTimer true and it's not already running
      if (setTimer === true) { this.setTimer(this.speed.value) }
    }
  }

  this.sendSpeed = function(bpm = null) {
    bpm = bpm || this.speed.value
    if (this.timer) {
      var period = (60000 / parseInt(bpm)) / this.beatDivisions
      this.timer.postMessage({ period })
    }
  }

  this.modSpeed = function (mod = 0, animate = false) {
    if (animate === true) {
      this.setSpeed(null, this.speed.target + mod)
    } else {
      this.setSpeed(this.speed.value + mod, this.speed.value + mod, true)
      client.update()
    }
  }

  // Controls

  this.togglePlay = function (msg = false) {
    if (this.isPaused === true) {
      this.play(msg)
    } else {
      this.stop(msg)
    }
    client.update()
  }

  this.play = function (msg = false, midiStart = false) {
    console.log('Clock', 'Play', msg, midiStart)
    if (this.isPaused === false && !midiStart) { return }
    this.isPaused = false
    if (this.isPuppet === true) {
      console.warn('Clock', 'External Midi control')
      if (!pulse.frame || midiStart) { // no frames counted while paused (starting from no clock, unlikely) or triggered by MIDI clock START
        this.setFrame(0) // make sure frame aligns with pulse count for an accurate beat
        pulse.frame = 0
        pulse.count = 5 // by MIDI standard next pulse is the beat
      }
    } else {
      if (msg === true) { client.io.midi.sendClockStart() }
      this.setSpeed(this.speed.target, this.speed.target, true)
    }
  }

  this.stop = function (msg = false) {
    console.log('Clock', 'Stop')
    if (this.isPaused === true) { return }
    this.isPaused = true
    if (this.isPuppet === true) {
      console.warn('Clock', 'External Midi control')
    } else {
      if (msg === true || client.io.midi.isClock) { client.io.midi.sendClockStop() }
      this.clearTimer()
    }
    client.io.midi.allNotesOff()
    client.io.midi.silence()
  }

  // External Clock

  const pulse = {
    count: 0,
    last: null,
    timer: null,
    frame: 0 // paused frame counter
  }

  this.tap = function () {
    pulse.count = (pulse.count + 1) % 6
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
    if (pulse.count == 0) {
      if (this.isPaused) { pulse.frame++ } else {
        if (pulse.frame > 0) {
          this.setFrame(client.orca.f + pulse.frame)
          pulse.frame = 0
        }
        client.run()
      }
    }
  }

  this.untap = function () {
    console.log('Clock', 'Puppeteering stops..')
    clearInterval(pulse.timer)
    this.isPuppet = false
    pulse.frame = 0
    pulse.last = null
    if (!this.isPaused) {
      this.setTimer(this.speed.value)
    }
  }

  // Groove

  this.setGroove = function(grooves, atFrameNum) {
    this.grooves = grooves;
    window.localStorage.setItem('grooves', JSON.stringify(this.grooves))
    this.sendGroove(grooves, atFrameNum)
  }

  this.sendGroove = function(grooves, atFrameNum) {
    grooves = grooves || this.grooves || [1]
    // default to setting for the next frame (assume running clock unless setTimer specifies)
    atFrameNum = atFrameNum || client.orca.f
    if (this.timer) {
      this.timer.postMessage({
        grooves: rotateArray(grooves, atFrameNum % grooves.length)
      })
    } 
  }

  // Timer

  this.setTimer = function (bpm) {
    if (bpm < 60) { console.warn('Clock', 'Error ' + bpm); return }
    this.clearTimer()
    window.localStorage.setItem('bpm', bpm)
    window.localStorage.setItem('grooves', JSON.stringify(this.grooves))
    this.timer = new Worker(worker)
    this.sendSpeed(bpm)
    this.sendGroove(this.grooves, client.orca.f)
    this.timer.postMessage({
      startTimer: true,
    });
    this.timer.onmessage = (event) => {
      // Send this tick
      client.io.midi.sendClock()
      client.run()
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
    client.orca.f = clamp(f, 0, 9999999)
  }

  // UI

  this.toString = function () {
    const diff = this.speed.target - this.speed.value
    const _offset = Math.abs(diff) > 5 ? (diff > 0 ? `+${diff}` : diff) : '' // TODO should 5 be beatDivisions + 1?
    const _message = this.isPuppet === true ? 'midi' : `${this.speed.value}${_offset}`
    const _beat = diff === 0 && client.orca.f % this.beatDivisions === 0 ? '*' : ''
    return `${_message}${_beat}`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }

  function rotateArray(arr, k) { return arr.slice(k).concat(arr.slice(0, k)) }
}
