'use strict'

function IO (terminal) {
  const Midi = require('./io.midi')

  this.midi = new Midi(terminal)

  const dgram = require('dgram')
  const Bridge = require('../../core/bridge')

  this.bridge = new Bridge(this)

  this.outputs = []
  this.stack = { }

  this.start = function () {
    this.midi.start()
    this.bridge.start()
    this.clear()
  }

  this.clear = function () {
    this.stack.udp = []
    this.midi.clear()
  }

  this.run = function () {
    this.midi.run()

    for (const id in this.stack.udp) {
      this.playUdp(this.stack.udp[id])
    }
  }

  this.update = function () {
    // Update Bridge Menu
    terminal.controller.clearCat('default', 'UDP Bridge')
    for (const id in this.bridge.routes) {
      console.log(terminal.io.bridge.active, id)
      terminal.controller.add('default', 'UDP Bridge', `${this.bridge.routes[id].name} ${terminal.io.bridge.active === id ? ' — Active' : ''}`, () => { terminal.io.bridge.select(id) }, '')
    }

    // Save
    terminal.controller.commit()

    terminal.io.midi.update()
  }

  // UDP

  this.sendUdp = function (msg) {
    this.stack.udp.push(msg)
  }

  this.playUdp = function (data) {
    const udp = dgram.createSocket('udp4')
    udp.send(Buffer.from(`${data}`), 49160, 'localhost', (err) => {
      udp.close()
    })
  }

  // Setup

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = IO
