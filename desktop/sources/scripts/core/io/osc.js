'use strict'

const osc = require('node-osc')

function Osc (terminal) {
  this.stack = []
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
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.push = function (path, msg) {
    this.stack.push({ path, msg })
  }

  this.play = function ({ path, msg }) {
    if (!this.client) { console.warn('OSC', 'Unavailable client'); return }
    if (!msg) { console.warn('OSC', 'Empty message'); return }
    const oscMsg = new osc.Message(path)
    for (var i = 0; i < msg.length; i++) {
      oscMsg.append(terminal.orca.valueOf(msg.charAt(i)))
    }
    this.client.send(oscMsg, (err) => {
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
    if (this.client) { this.client.close() }
    this.client = new osc.Client(terminal.io.ip, this.port)
    console.info('OSC', `Started client at ${terminal.io.ip}:${this.port}`)
  }
}
