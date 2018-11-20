'use strict'

const Fn = require('../fn')

function FnMidi (pico, x, y, passive) {
  Fn.call(this, pico, x, y, ';', true)

  this.name = 'udp'
  this.info = 'Sends a string via UDP to localhost.'

  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 1, 16)
    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    if (!this.bang()) { return }

    this.draw = false

    let msg = ''
    for (let x = 0; x < this.len; x++) {
      msg += pico.glyphAt(1 + this.x + x, this.y)
    }

    const dgram = require('dgram')
    const message = Buffer.from(`${msg}`)
    const client = dgram.createSocket('udp4')
    client.send(message, 49160, 'localhost', (err) => {
      client.close()
    })
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnMidi
