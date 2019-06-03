'use strict'

import Operator from '../operator.js'
import {OCTAVE} from "../scales.js";

export default function OperatorMidi (orca, x, y, passive) {
    Operator.call(this, orca, x, y, ':', true)

    this.name = 'midi'
    this.info = 'Sends MIDI note'

    this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 } }
    this.ports.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } }
    this.ports.note = { x: 3, y: 0 }
    this.ports.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
    this.ports.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 16 } }
    this.ports.key = {x: 6, y: 0}
    this.ports.scale = {x: 7, y: 0, default: '0'}

    this.operation = function (force = false) {
        if (!this.hasNeighbor('*') && force === false) { return }
        const key = this.listen(this.ports.key)
        const scale = this.listen(this.ports.scale)
        const channel = this.listen(this.ports.channel)
        if (channel === '.') { return }
        let octave = this.listen(this.ports.octave)
        if (octave === '.') { return }
        let note = this.listen(this.ports.note, key!=='.' ? true : false)
        if (note === '.') { return }

        if(key!=='.' && OCTAVE.includes(key)) {
            const noteAndOct = this.resolveDegree(key,scale,note)
            note = noteAndOct.note;
            octave = parseInt(octave) + noteAndOct.octave;
        }

        if (!isNaN(note)) { return }

        const velocity = this.listen(this.ports.velocity, true)
        const length = this.listen(this.ports.length, true)

        terminal.io.midi.send(channel, octave, note, velocity, length)

        if (force === true) {
            terminal.io.midi.run()
        }

        this.draw = false
    }
}