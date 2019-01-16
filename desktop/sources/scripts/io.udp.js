'use strict'

const dgram = require('dgram')

function Udp (terminal) {
  this.index = 0
  this.stack = []
  this.server = null
  this.port = 49160
  this.ip = '127.0.0.1'

  this.start = function () {
    console.info('UDP Starting..')
    this.setup()
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
    console.log('UDP Port: ', port)
    this.port = port
    return this
  }

  this.setup = function () {
    this.server = dgram.createSocket('udp4')
  }
}

module.exports = Udp
