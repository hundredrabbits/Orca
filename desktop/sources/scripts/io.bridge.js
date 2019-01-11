'use strict'

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

    if(route.protocol === 'udp') {
      this.port.send(Buffer.from(`${data}`), route.port, route.remoteAddress, (err) => {
        if(err) { console.log(err) }
      })
    }
    else if(route.protocol === 'osc') {
      const split = data.split('.').filter(d => d !== '')
      console.log( split )
      if(split.length === 2) {
        const key = split[0]
        const definition = route[key]
        const value = definition.type === 'f' ? parseInt(split[1]) / 10 : split[1]

        console.log(`${definition.path} s${definition.type} ${definition.name} ${value} -> ${route.remoteAddress}:${route.port}`)

        this.port.send(definition.path, definition.name, value, (err) => {
          if(err) { console.log(err) }
        })
      }
    }
  }

  this.createPort = function (route) {
    if(route.protocol === 'udp') {
      const dgram = require('dgram')
      return dgram.createSocket('udp4')
    }
    
    if(route.protocol === 'osc') {
      const osc = require('node-osc')
      return new osc.Client(route.remoteAddress, route.port)
    }
  }

  this.select = function (id) {
    if (!this.routes[id]) { return }
    this.index = parseInt(id)
    console.info(`Bridge Route: ${this.route().name}`)

    this.port = this.createPort(this.route())

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
