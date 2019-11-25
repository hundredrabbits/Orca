'use strict'

function Udp (client) {
  const dgram = require('dgram')

  this.stack = []
  this.port = null
  this.options = { default: 49161, orca: 49160 }
  this.socket = dgram ? dgram.createSocket('udp4') : null
  this.listener = dgram ? dgram.createSocket('udp4') : null

  this.start = function () {
    if (!this.socket || !this.listener) { console.warn('UDP', 'Could not start.'); return }
    console.info('UDP', 'Starting..')

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

    this.listener.bind(49160)

    this.select()
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

  this.select = function (port = this.options.default) {
    if (parseInt(port) === this.port) { console.warn('UDP', 'Already selected'); return }
    if (isNaN(port) || port < 1000) { console.warn('UDP', 'Unavailable port'); return }
    console.info('UDP', `Selected port: ${port}`)
    this.port = parseInt(port)
  }
}
