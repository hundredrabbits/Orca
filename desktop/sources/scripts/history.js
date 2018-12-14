'use strict'

function History (terminal, orca = terminal.room) {
  this.index = 0
  this.frames = []

  this.record = function () {
    if (this.index === this.frames.length) {
      this.append()
    } else {
      this.fork()
    }
    this.index = this.frames.length
  }

  this.undo = function () {
    if (this.index === 0) { console.warn('History', 'Reached beginning'); return }
    this.index = clamp(this.index - 1, 0, this.frames.lengt - 1)
    terminal.load(this.frames[this.index], terminal.rooms.hall.f)
  }

  this.redo = function () {
    if (this.index > this.frames.length - 1) { console.warn('History', 'Reached end'); return }
    this.index = clamp(this.index + 1, 0, this.frames.lengt - 1)
    terminal.load(this.frames[this.index], terminal.rooms.hall.f)
  }

  this.reset = function () {
    this.index = 0
    this.frames = []
  }

  this.append = function () {
    // this.frames.push(`${orca}`)
  }

  this.fork = function () {
    // this.frames = this.frames.slice(0, this.index + 1)
    // this.frames.push(`${orca}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = History
