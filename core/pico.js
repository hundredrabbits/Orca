'use strict'

const Program = require('./program')

function Pico () {

  this.program = new Program(39, 29)

  this.f = 0
  this.is_paused = false

  this.start = function () {
    setInterval(() => { this.run() }, 200)
  }

  this.new = function () {
    this.program.reset()
  }

  this.reset = function () {
    this.new()
  }

  this.run = function (force = false) {
    if (this.is_paused && !force) { return }

    this.program.run()
    this.f += 1
  }

  this.pause = function () {
    this.is_paused = !this.is_paused
  }
}

module.exports = Pico