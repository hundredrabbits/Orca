'use strict'

function Osc (client) {
  const osc = require('node-osc')

  this.stack = []
  this.socket = null
  this.port = null
  this.options = { default: 49162, tidalCycles: 6010, sonicPi: 4559, superCollider: 57120, norns: 10111 }

  this.start = function () {
    if (!osc) { console.warn('OSC', 'Could not start.'); return }
    console.info('OSC', 'Starting..')
    this.setup()
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

  this.push = function (path, msg) {
    this.stack.push({ path, msg })
  }

  this.play = function ({ path, msg }) {
    if (!this.socket) { console.warn('OSC', 'Unavailable socket'); return }
    if (!msg) { console.warn('OSC', 'Empty message'); return }
    const oscMsg = new osc.Message(path)
    for (var i = 0; i < msg.length; i++) {
      oscMsg.append(client.orca.valueOf(msg.charAt(i)))
    }
    this.socket.send(oscMsg, (err) => {
      if (err) { console.warn(err) }
    })
  }

  this.select = function (port = this.options.default) {
    if (parseInt(port) === this.port) { console.warn('OSC', 'Already selected'); return }
    if (isNaN(port) || port < 1000) { console.warn('OSC', 'Unavailable port'); return }
    console.info('OSC', `Selected port: ${port}`)
    this.port = parseInt(port)
    this.setup()
  }

  this.setup = function () {
    if (!this.port) { return }
    if (this.socket) { this.socket.close() }
    this.socket = new osc.Client(client.io.ip, this.port)
    console.info('OSC', `Started socket at ${client.io.ip}:${this.port}`)
  }
}
