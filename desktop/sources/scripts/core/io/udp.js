'use strict'

const dgram = require('dgram')

function Udp (terminal) {
  this.stack = []
  this.port = null
  this.options = { default: 49161, orca: 49160 }
  this.client = dgram ? dgram.createSocket('udp4') : null
  this.listener = dgram ? dgram.createSocket('udp4') : null

  this.start = function () {
    if (!this.client || !this.listener) { console.warn('UDP', 'Could not start.'); return }
    console.info('UDP', 'Starting..')

    this.listener.on('message', (msg, rinfo) => {
      terminal.commander.trigger(`${msg}`, false)
    })

    this.listener.on('listening', () => {
      const address = this.listener.address()
      console.info('UDP', `Started client at ${address.address}:${address.port}`)
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
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.push = function (msg) {
    this.stack.push(msg)
  }

  this.play = function (data) {
    this.client.send(Buffer.from(`${data}`), this.port, terminal.io.ip, (err) => {
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
