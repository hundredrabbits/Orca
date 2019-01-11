'use strict'

const dgram = require('dgram')
const server = dgram.createSocket('udp4')
// const osc = require('osc')

function Bridge (terminal) {
  this.index = 0
  this.routes = []
  this.stack = []

  this.start = function () {
    console.info('Starting Bridge(UDP/OSC)..')
    this.setup()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id], this.route())
    }
  }

  this.update = function () {
    terminal.controller.clearCat('default', 'UDP Bridge')
    for (const id in terminal.io.bridge.routes) {
      terminal.controller.add('default', 'UDP Bridge', `${this.routes[id].name} ${this.index === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.bridge.select(id) }, '')
    }
    terminal.controller.commit()
  }

  this.send = function (msg) {
    this.stack.push(msg)
  }

  this.play = function (data, route) {
    console.log(`Sending ${data}, via ${route.name}`)
    server.send(Buffer.from(`${data}`), 49160, 'localhost', (err) => {
      server.close()
    })
  }

  this.select = function (id) {
    if (!this.routes[id]) { return }
    this.index = parseInt(id)
    console.info(`Bridge Route: ${this.route().name}`)
    this.update()
  }

  this.route = function () {
    return this.routes[this.index]
  }

  this.setup = function () {
    this.routes = [
      require('../../core/bridge/default'),
      require('../../core/bridge/tidal'),
      require('../../core/bridge/sonicpi')
    ]
    terminal.io.bridge.select(0)
  }
}

module.exports = Bridge
