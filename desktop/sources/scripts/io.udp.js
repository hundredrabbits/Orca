'use strict'

const dgram = require('dgram')

function Udp (terminal) {
  this.index = 0
  this.stack = []
  this.server = null

  this.start = function () {
    console.info('Starting UDP..')
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
    this.server.send(Buffer.from(`${data}`), this.config.port, this.config.address, (err) => {
      if (err) { console.log(err) }
    })
  }

  this.setup = function () {
    this.config = require('../../core/bridge/udp.conf')
    this.server = dgram.createSocket('udp4')
  }
}

module.exports = Udp
