'use strict'

const dgram = require('dgram')

function Udp (terminal) {
  this.stack = []
  this.port = null
  this.options = { default: 49161, orca: 49160 }

  this.start = function () {
    console.info('UDP Starting..')
    this.select()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (msg) {
    this.stack.push(msg)
  }

  this.play = function (data) {
    this.server.send(Buffer.from(`${data}`), this.port, '127.0.0.1', (err) => {
      if (err) { console.log(err) }
    })
  }

  this.select = function (port = this.options.default) {
    if (port < 1000) { console.warn('Unavailable port'); return }
    this.port = port
    this.update()
  }

  this.update = function () {
    console.log(`UDP Port: ${this.port}`)
    terminal.controller.clearCat('default', 'UDP')
    for (const id in this.options) {
      terminal.controller.add('default', 'UDP', `${id.charAt(0).toUpperCase() + id.substr(1)}(${this.options[id]}) ${this.port === this.options[id] ? ' — Active' : ''}`, () => { terminal.io.udp.select(this.options[id]) }, '')
    }
    terminal.controller.commit()
  }

  this.server = dgram.createSocket('udp4')
  this.listener = dgram.createSocket('udp4')

  // Input

  this.listener.on('message', (msg, rinfo) => {
    return this.act(`${msg}`)
  })

  this.listener.on('listening', () => {
    const address = this.listener.address()
    console.log(`UDP Listening: ${address.address}:${address.port}`)
  })

  this.listener.on('error', (err) => {
    console.log(`Server error:\n ${err.stack}`)
    this.listener.close()
  })

  this.act = function (msg) {
    const key = `${msg}`.substr(0, 1).toLowerCase()
    const val = `${msg}`.substr(1)
    const int = parseInt(`${msg}`.substr(1))
    if (key === 'p') {
      terminal.play()
    } else if (key === 's') {
      terminal.stop()
    } else if (key === 'r') {
      terminal.run()
    } else if (key === 'g') {
      return `${terminal.orca}`
    } else if (key === 'f' && Number.isInteger(int)) {
      terminal.orca.f = int
    } else if (key === 'b' && Number.isInteger(int)) {
      terminal.setSpeed(int)
    } else if (key === 'w' && val.length >= 4 && val.indexOf(':') > -1) {
      const pos = val.substr(1).split(':')
      terminal.orca.write(parseInt(pos[0]), parseInt(pos[1]), val.substr(0, 1))
    } else {
      console.warn(`Unknown message: ${msg}`)
    }
    return 'done.'
  }

  this.listener.bind(49160)
}

module.exports = Udp
