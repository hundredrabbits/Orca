'use strict'

const osc = require('node-osc')

function Osc (terminal) {
  this.stack = []
  this.port = 49162
  this.ip = '127.0.0.1'

  this.start = function () {
    console.info('OSC Starting..')
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

  this.send = function (path, msg) {
    this.stack.push({ path, msg })
  }

  this.play = function ({ path, msg }) {
    const oscMsg = new osc.Message(path)
    for (var i = 0; i < msg.length; i++) {
      oscMsg.append(terminal.orca.valueOf(msg.charAt(i)))
    }
    this.client.send(oscMsg, (err) => {
      if (err) { console.warn(err) }
    })
  }

  this.select = function (port) {
    if (port < 1000) { console.warn('Unavailable port'); return }
    this.port = port
    this.setup()
    console.log(`OSC Port: ${this.port}`)
    return this.port
  }

  this.setup = function () {
    if (this.client) { this.client.kill() }
    this.client = new osc.Client(this.ip, this.port)
  }
}

module.exports = Osc
