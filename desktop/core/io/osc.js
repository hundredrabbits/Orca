'use strict'

const osc = require('node-osc')

function Osc (terminal) {
  this.stack = []
  this.port = null
  this.options = { default: 49162, tidalCycles: 6010, sonicPi: 4559 }

  this.start = function () {
    console.info('OSC Starting..')
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

  this.select = function (port = this.options.default) {
    if (port < 1000) { console.warn('Unavailable port'); return }
    this.port = port
    this.setup()
    this.update()
  }

  this.update = function () {
    console.log(`OSC Port: ${this.port}`)
    terminal.controller.clearCat('default', 'OSC')
    for (const id in this.options) {
      terminal.controller.add('default', 'OSC', `${id.charAt(0).toUpperCase() + id.substr(1)}(${this.options[id]}) ${this.port === this.options[id] ? ' — Active' : ''}`, () => { terminal.io.osc.select(this.options[id]) }, '')
    }
    terminal.controller.commit()
  }

  this.setup = function (ip = '127.0.0.1') {
    if (this.client) { this.client.close() }
    this.client = new osc.Client(ip, this.port)
  }
}

module.exports = Osc
