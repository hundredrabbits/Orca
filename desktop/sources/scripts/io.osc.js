'use strict'

const osc = require('node-osc')

function Osc (terminal) {
  this.stack = []
  this.port = 49162
  this.ip = '127.0.0.1'

  this.start = function () {
    console.info('Starting OSC..')
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
    const args = msg.split('/')

    for (let i = 0, l = args.length; i < l; i++) {
      if (/\b\d+f\b/.test(args[i])) { // send as float
        oscMsg.append({ type: 'f', value: parseInt(args[i]) / 10.0 })
      } else if (/\b\d+\b/.test(args[i])) { // send as int
        oscMsg.append(parseInt(args[i]))
      } else { // send as string
        oscMsg.append(args[i])
      }
    }

    this.client.send(oscMsg, (err) => {
      if (err) { console.warn(err) }
    })
  }

  this.select = function (port) {
    if (port < 1000) { console.warn('Unavailable port'); return }
    this.port = port
    this.setup()
  }

  this.setup = function () {
    if (this.client) { this.client.kill() }
    this.client = new osc.Client(this.ip, this.port)
  }
}

module.exports = Osc
