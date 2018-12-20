'use strict'

function History (terminal, orca = terminal.orca) {
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
    if (terminal.orca.id !== 'lobby') { console.warn('History', 'Outside Lobby'); return }
    if (this.index === 0) { console.warn('History', 'Reached beginning'); return }

    this.index = clamp(this.index - 1, 0, this.frames.lengt - 1)
    this.apply(this.frames[this.index])
  }

  this.redo = function () {
    if (terminal.orca.id !== 'lobby') { console.warn('History', 'Outside Lobby'); return }
    if (this.index > this.frames.length - 1) { console.warn('History', 'Reached end'); return }

    this.index = clamp(this.index + 1, 0, this.frames.lengt - 1)
    this.apply(this.frames[this.index])
  }

  this.apply = function (f) {
    if (!f || f.length !== terminal.orca.s.length) { return }
    terminal.orca.s = this.frames[this.index]
  }

  this.reset = function () {
    this.index = 0
    this.frames = []
  }

  this.append = function () {
    this.frames.push(terminal.orca.s)
  }

  this.fork = function () {
    this.frames = this.frames.slice(0, this.index + 1)
    this.frames.push(terminal.orca.s)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = History
