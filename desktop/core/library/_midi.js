'use strict'

import Operator from '../operator.js'

export default function OperatorMidi (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends MIDI note'

  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 } }
  this.ports.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } }
  this.ports.note = { x: 3, y: 0 }
  this.ports.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
  this.ports.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 16 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }

<<<<<<< HEAD
    if (this.listen(this.ports.input.channel) === '.') { return }
    if (this.listen(this.ports.input.octave) === '.') { return }
    if (this.listen(this.ports.input.note) === '.') { return }
    if (!isNaN(this.listen(this.ports.input.note))) { return }
=======
    const channel = this.listen(this.ports.channel)
    if (channel === '.') { return }
    const octave = this.listen(this.ports.octave)
    if (octave === '.') { return }
    const note = this.listen(this.ports.note)
    if (note === '.') { return }
>>>>>>> master

    if (!isNaN(note)) { return }

    const velocity = this.listen(this.ports.velocity, true)
    const length = this.listen(this.ports.length, true)

    terminal.io.midi.send(channel, octave, note, velocity, length)

    if(channel < 4){
      if(rawNote === "C"){
        terminal.io.udp.send('f:9')  
      }
      else{
        terminal.io.udp.send('f:4')
      }
    }
    else if(channel > 7 && channel < 12 && !isNaN(transposed.id)){
      terminal.io.udp.send(`l:${parseInt(transposed.id)%16}`)
    }
    else if(channel > 2 && channel < 8 && !isNaN(transposed.id)){
      terminal.io.udp.send(`n:${parseInt(transposed.id)%16}`)
    }

    if(!isNaN(note) && !isNaN(channel)){
      terminal.io.udp.send(`d:${parseInt(note)%16};${parseInt(channel)}`)  
    }

    if (force === true) {
      terminal.io.midi.run()
    }

    this.draw = false
  }
}
