'use strict'

export default function Monome (terminal) {
  const serialosc = require('serialosc')
  this.device = null

  this.start = function () {
    serialosc.start()
    serialosc.on('device:add', (device) => { this.add(device) })
  }

  this.add = function (device) {
    console.log('Monome', 'Model: ' + device.model)
    this.device = device
    this.device.on('key', (data) => { this.onKey(data) })
  }

  this.onKey = function (data) {
    terminal.cursor.moveTo(data.x, data.y)
    this.device.set(data)
  }
}
