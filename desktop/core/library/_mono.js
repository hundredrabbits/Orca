'use strict'

const Operator = require('../operator')

const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']
const MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const MINOR = ['c', 'd', 'F', 'f', 'g', 'a', 'C']

function OperatorMono (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ':', true)

  this.name = 'mono'
  this.info = 'Sends MIDI note to a monophonic instrument.'

  this.ports.input.octave = { x: 1, y: 0 }
  this.ports.input.note = { x: 2, y: 0 }
  this.ports.input.length = { x: 3, y: 0 }

  this.run = function (force = false) {
    if (!this.bang() && force === false) { return }

    const rawOctave = this.listen(this.ports.input.octave, true, 0, 8, -1)
    const rawNote = this.listen(this.ports.input.note)
    const rawLength = this.listen(this.ports.input.length, true, 0, 16, 1)

    if (rawOctave === -1) { return }
    if (rawNote === '.' || !isNaN(rawNote)) { return }

    const transposed = transpose(rawOctave, rawNote)
    // 1 - 8
    const octave = clamp(transposed.note === 'b' ? transposed.octave + 1 : transposed.octave, 0, 8)
    // 0 - 11
    const note = OCTAVE.indexOf(transposed.note)
    // 0 - G(16)
    const length = rawLength

    if (note < 0) { return }

    this.draw = false

    terminal.io.mono.send(octave, note, length)
  }

  function transpose (octave, note) {
    if (OCTAVE.indexOf(note) > -1) { return { octave, note } }
    const noteArray = isUpperCase(note) === true ? MAJOR : MINOR
    const noteIndex = letterValue(note) - 7
    const noteMod = noteArray[noteIndex % noteArray.length]
    const octaveMod = Math.floor(noteIndex / noteArray.length) + 1
    return { octave: octave + octaveMod, note: noteMod === 'e' ? 'F' : noteMod === 'b' ? 'C' : noteMod }
  }

  function letterValue (c) { return c.toLowerCase().charCodeAt(0) - 97 }
  function isUpperCase (s) { return `${s}`.toUpperCase() === `${s}` }
  function clampNotes (n) { return n === 'e' ? 'F' : n === 'b' ? 'C' : n }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorMono
