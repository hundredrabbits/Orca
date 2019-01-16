'use strict'

const osc = require('node-osc')

function Osc (terminal) {
  this.stack = []

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
    this.stack.push({path, msg})
  }

  this.play = function ({path, msg}) {
    const oscMsg = new osc.Message(path)

    const args = msg.split('/')

    for (let i = 0, l = args.length; i < l; i++) {
      if (/\b\d+f\b/.test(args[i])) { // send as float
        oscMsg.append({ type: 'f', value: parseInt(args[i]) / 10.0 })
      }
      else if (/\b\d+\b/.test(args[i])) { // send as int
        oscMsg.append(parseInt(args[i]))
      }
      else { // send as string
        oscMsg.append(args[i])
      }
    }

    this.client.send(oscMsg, (err) => {
      if (err) { console.warn(err) }
    })
  }

  this.select = function (port) {
    this.client.kill()
    this.client = new osc.Client('127.0.0.1', port)
  }
  
  this.setup = function () {
    this.client = new osc.Client('127.0.0.1', 49162)
  }
}

module.exports = Osc
