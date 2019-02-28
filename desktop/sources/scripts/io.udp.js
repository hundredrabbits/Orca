'use strict'

const dgram = require('dgram')

function Udp (terminal) {
  this.index = 0
  this.stack = []
  this.server = dgram.createSocket('udp4')
  this.listener = dgram.createSocket('udp4')
  this.port = 49160
  this.ip = '127.0.0.1'

  this.start = function () {
    console.info('UDP Starting..')
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
    this.server.send(Buffer.from(`${data}`), this.port, this.ip, (err) => {
      if (err) { console.log(err) }
    })
  }

  this.select = function (port = 49160) {
    if (port < 1000) { console.warn('Unavailable port'); return }
    this.port = port
    console.log(`UDP Port: ${this.port}`)
    return this.port
  }

  // Input

  this.listener.on('message', (msg, rinfo) => {
    this.act(`${msg}`.toLowerCase())
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
    const key = `${msg}`.substr(0, 1)
    const val = `${msg}`.substr(1)
    const int = parseInt(`${msg}`.substr(1))
    if (key === 'p') {
      terminal.play()
    } else if (key === 's') {
      terminal.stop()
    } else if (key === 'r') {
      terminal.run()
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
  }

  this.listener.bind(49161)
}

module.exports = Udp
