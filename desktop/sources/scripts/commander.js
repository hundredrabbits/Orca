'use strict'

const patterns = require('./patterns')

function Commander (terminal) {
  this.isActive = false
  this.query = ''

  this.start = function () {
    this.isActive = true
    this.query = ''
    terminal.update()
  }

  this.stop = function () {
    this.isActive = false
    this.query = ''
    terminal.update()
  }

  this.erase = function () {
    this.query = this.query.slice(0, -1)
    this.preview()
  }

  this.write = function (key) {
    if (key.length !== 1) { return }
    this.query += key.toLowerCase()
    this.preview()
  }

  this.run = function () {
    const tool = this.isActive === true ? 'commander' : 'cursor'
    terminal[tool].trigger()
    terminal.update()
  }

  this.read = function (key) {
    const tool = this.isActive === true ? 'commander' : 'cursor'
    terminal[tool].write(event.key)
    terminal.update()
  }

  this.trigger = function (msg = this.query) {
    const key = `${msg}`.substr(0, 1).toLowerCase()
    const val = `${msg}`.substr(1)
    const int = parseInt(`${msg}`.substr(1))
    if (key === 'p') {
      terminal.clock.play()
    } else if (key === 's') {
      terminal.clock.stop()
    } else if (key === 'r') {
      terminal.run()
    } else if (key === 'i') {
      terminal.commander.inject(val)
    } else if (key === 'f' && Number.isInteger(int)) {
      terminal.orca.f = int
    } else if (key === '/') {
      terminal.cursor.goto(val)
    } else if (key === 'b' && Number.isInteger(int)) {
      terminal.clock.set(int, int, true)
    } else if (key === 'a' && Number.isInteger(int)) {
      terminal.clock.set(null, int)
    } else if (key === 'w' && val.length >= 4 && val.indexOf(':') > -1) {
      const pos = val.substr(1).split(':')
      terminal.orca.write(parseInt(pos[0]), parseInt(pos[1]), val.substr(0, 1))
    } else {
      console.warn(`Unknown message: ${msg}`)
    }
    this.stop()
  }

  // Injections

  this.inject = function (val) {
    const result = patterns[val] ? patterns[val].trim().split('\n') : null
    if (!result) { return }
    terminal.cursor.writeBlock(result)
    terminal.cursor.reset()
  }

  this.preview = function () {
    if (this.query.substr(0, 1) !== 'i') { return }
    const val = this.query.substr(1)
    const result = patterns[val] ? patterns[val].trim().split('\n') : null
    if (!result) { terminal.cursor.reset(); return }
    terminal.cursor.resize(result[0].length, result.length)
  }

  // UI

  this.toString = function () {
    return `${this.query}`
  }
}

module.exports = Commander
