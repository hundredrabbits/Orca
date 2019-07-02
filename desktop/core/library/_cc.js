'use strict'

import Operator from '../operator.js'

export default function OperatorCC (orca, x, y) {
  Operator.call(this, orca, x, y, '!', true)

  this.name = 'cc'
  this.info = 'Sends MIDI cc/program change/pitchbend'
  this.ports.message = { x: 1, y: 0, clamp: { min: 0, max: 15 } }
  this.ports.channel = { x: 2, y: 0, clamp: { min: 0, max: 15 } }
  this.ports.data1 = { x: 3, y: 0, clamp: { min: 0 } }
  this.ports.data2 = { x: 4, y: 0, clamp: { min: 0 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.message) === '.') { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.data1) === '.') { return }

    const message = this.listen(this.ports.message, true)
    const channel = this.listen(this.ports.channel, true)
	const data1 = this.listen(this.ports.data1, true)
	
	if (message === 2) {
    	const data1 = Math.ceil((127 * this.listen(this.ports.data1, true)) / 35)
	}
    const rawdata2 = this.listen(this.ports.data2, true)
    const data2 = Math.ceil((127 * rawdata2) / 35)

    this.draw = false
    terminal.io.cc.send(channel, data1, data2, message)

    if (force === true) {
		terminal.io.cc.run()        	
    }
  }
}
