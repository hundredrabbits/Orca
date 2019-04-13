'use strict'

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

  this.erase = function () {
    this.query = this.query.slice(0, -1)
  }

  this.write = function (key) {
    if (key.length !== 1) { return }
    this.query += key
  }

  this.run = function () {
    const tool = this.isActive === true ? 'commander' : 'cursor'
    terminal[tool].trigger()
    terminal.update()
  }

  this.read = function (key) {
    const tool = this.isActive === true ? 'commander' : 'cursor'
    const func = event.key === 'Backspace' ? 'erase' : 'write'

    terminal[tool][func](event.key)
    terminal.update()
  }

  this.toString = function () {
    return `${this.query}`
  }
}

module.exports = Commander
