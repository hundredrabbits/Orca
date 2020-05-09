'use strict'

function Udp (client) {
  const dgram = require('dgram')

  this.stack = []
  this.port = null
  this.socket = dgram ? dgram.createSocket('udp4') : null
  this.listener = dgram ? dgram.createSocket('udp4') : null

  this.start = function () {
    if (!dgram || !this.socket || !this.listener) { console.warn('UDP', 'Could not start.'); return }
    console.info('UDP', 'Starting..')

    this.selectInput()
    this.selectOutput()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const item of this.stack) {
      this.play(item)
    }
  }

  this.push = function (msg) {
    this.stack.push(msg)
  }

  this.play = function (data) {
    if (!this.socket) { return }
    this.socket.send(Buffer.from(`${data}`), this.port, client.io.ip, (err) => {
      if (err) { console.warn(err) }
    })
  }

  this.selectOutput = function (port = 49161) {
    if (!dgram) { console.warn('UDP', 'Unavailable.'); return }
    if (parseInt(port) === this.port) { console.warn('UDP', 'Already selected'); return }
    if (isNaN(port) || port < 1000) { console.warn('UDP', 'Unavailable port'); return }

    console.log('UDP', `Output: ${port}`)
    this.port = parseInt(port)
  }

  this.selectInput = (port = 49160) => {
    if (!dgram) { console.warn('UDP', 'Unavailable.'); return }
    if (this.listener) { this.listener.close() }

    console.log('UDP', `Input: ${port}`)
    this.listener = dgram.createSocket('udp4')

    this.listener.on('message', (msg, rinfo) => {
      client.commander.trigger(`${msg}`)
    })

    this.listener.on('listening', () => {
      const address = this.listener.address()
      console.info('UDP', `Started socket at ${address.address}:${address.port}`)
    })

    this.listener.on('error', (err) => {
      console.warn('UDP', `Server error:\n ${err.stack}`)
      this.listener.close()
    })

    this.listener.bind(port)
  }
}
