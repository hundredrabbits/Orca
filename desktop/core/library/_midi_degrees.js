'use strict'

import Operator from '../operator.js'

export default function OperatorMidiDegrees(orca, x, y, passive) {
    Operator.call(this, orca, x, y, '_', true)

    const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']

    const SCALES = [
        [0, 2, 4, 5, 7, 9, 11], //major
        [0, 1, 3, 5, 7, 8, 10], //minor
        [0, 3, 5, 7, 10], //minor_pentatonic
        [0, 2, 5, 7, 9], //major_pentatonic
        [0, 2, 3, 4, 7, 9], //blues_major
        [0, 3, 5, 6, 7, 10], //blues_minor
        [0, 1, 3, 5, 6, 8, 10], //dorian
        [0, 2, 3, 5, 7, 8, 10], //phrygian
        [0, 2, 4, 5, 7, 9, 10], //lydian
        [0, 2, 4, 6, 7, 9, 11], //mixolydian
        [0, 1, 3, 5, 7, 8, 10], //aeolian
        [0, 2, 3, 5, 7, 9, 10], //locrian
        [0, 2, 4, 5, 7, 9], //hex_major6
        [0, 3, 5, 7, 8, 10], //hex_dorian
        [0, 2, 5, 7, 9, 10], //hex_phrygian
        [0, 2, 4, 7, 9, 11], //hex_major7
        [0, 1, 3, 5, 8, 10], //hex_sus
        [0, 2, 3, 5, 7, 10], //hex_aeolian
        [0, 2, 4, 5, 7, 9, 10, 11], //bebop_dominant
        [0, 3, 5, 8, 10], //egyptian
        [0, 3, 5, 8, 10], //shang
        [0, 2, 5, 7, 10], //jiao
        [0, 2, 4, 7, 9], //zhi
        [0, 2, 4, 7, 9], //ritusen
        [0, 2, 4, 6, 8, 10], //whole
        [0, 2, 3, 5, 7, 8, 11], //harmonic_minor
        [0, 2, 3, 5, 7, 9, 11], //melodic_minor_asc
        [0, 2, 3, 6, 7, 8, 11], //hungarian_minor
        [0, 2, 3, 5, 6, 8, 9, 11], //octatonic
        [0, 2, 4, 6, 8, 10], //messiaen1
        [0, 1, 3, 4, 6, 7, 9, 10], //messiaen2
        [0, 2, 3, 4, 6, 7, 8, 10, 11], //messiaen3
        [0, 1, 2, 5, 6, 7, 8, 11], //messiaen4
        [0, 1, 5, 6, 7, 11], //messiaen5
        [0, 3, 4, 7, 8, 11], //augmented
        [0, 2, 4, 5, 6, 8, 10, 11], //messiaen6
        /* Not accessible after z=36 */
        [0, 1, 2, 3, 5, 6, 7, 8, 9, 11], //messiaen7
        [0, 1, 3, 4, 6, 8, 10], //super_locrian
        [0, 2, 3, 7, 8], //hirajoshi
        [0, 2, 3, 7, 9], //kumoi
        [0, 1, 3, 5, 7, 9, 11], //neapolitan_major
        [0, 2, 4, 5, 7, 8, 10], //bartok
        [0, 1, 4, 5, 7, 8, 11], //bhairav
        [0, 2, 4, 5, 6, 8, 10], //locrian_major
        [0, 1, 4, 5, 7, 9, 10], //ahirbhairav
        [0, 1, 4, 6, 8, 10, 11], //enigmatic
        [0, 1, 3, 5, 7, 8, 11], //neapolitan_minor
        [0, 1, 3, 7, 8], //pelog
        [0, 1, 4, 5, 8, 9], //augmented2
        [0, 1, 4, 7, 9], //scriabin
        [0, 2, 4, 5, 7, 8, 11], //harmonic_major
        [0, 2, 3, 5, 7, 8, 10], //melodic_minor_desc
        [0, 2, 3, 6, 7, 9, 10], //romanian_minor
        [0, 2, 4, 5, 7, 8, 10], //hindu
        [0, 1, 5, 6, 10], //iwato
        [0, 2, 3, 5, 7, 9, 11], //melodic_minor
        [0, 2, 3, 5, 6, 8, 9, 11], //diminished2
        [0, 1, 4, 6, 7, 9, 11], //marva
        [0, 2, 4, 5, 7, 8, 10], //melodic_major
        [0, 4, 5, 7, 10], //indian
        [0, 1, 4, 5, 7, 8, 10], //spanish
        [0, 2, 4, 6, 11], //prometheus
        [0, 1, 3, 4, 6, 7, 9, 10], //diminished
        [0, 1, 3, 6, 7, 8, 11], //todi
        [0, 2, 4, 6, 8, 10, 11], //leading_whole
        [0, 1, 4, 6, 7, 8, 11], //purvi
        [0, 4, 6, 7, 11], //chinese
        [0, 2, 4, 6, 7, 8, 10], //lydian_minor
    ];

    this.name = 'dmidi'
    this.info = 'Sends MIDI note from degree, key and scale'

    this.ports.channel = {x: 1, y: 0, clamp: {min: 0, max: 16}}
    this.ports.octave = {x: 2, y: 0, clamp: {min: 0, max: 8}}
    this.ports.degree = {x: 3, y: 0}
    this.ports.key = {x: 4, y: 0, default: "C"}
    this.ports.scale = {x: 5, y: 0, default: "0"}
    this.ports.velocity = {x: 6, y: 0, default: 'f', clamp: {min: 0, max: 16}}
    this.ports.length = {x: 7, y: 0, default: '1', clamp: {min: 0, max: 16}}

    this.operation = function (force = false) {
        if (!this.hasNeighbor('*') && force === false) {
            return
        }

        if (this.listen(this.ports.channel) === '.') {
            return
        }
        if (this.listen(this.ports.octave) === '.') {
            return
        }
        if (this.listen(this.ports.degree) === '.') {
            return
        }

        const channel = this.listen(this.ports.channel, true)
        let rawOctave = this.listen(this.ports.octave, true)
        let rawNote = this.listen(this.ports.degree, true)
        const rawVelocity = this.listen(this.ports.velocity, true)
        const length = this.listen(this.ports.length, true)
        const key = this.listen(this.ports.key)
        const scale = this.listen(this.ports.scale, true)

        const noteInOct = resolveDegree(key, scale, rawNote);

        rawNote = noteInOct.note;
        rawOctave = rawOctave + noteInOct.octave;

        if (!isNaN(rawNote)) {
            return
        }

        const transposed = this.transpose(rawNote, rawOctave)
        // 1 - 8
        const octave = transposed.octave
        // 0 - 11
        const note = transposed.value
        // 0 - G(127)
        const velocity = parseInt((rawVelocity / 16) * 127)

        this.draw = false

        terminal.io.midi.send(channel, octave, note, velocity, length)

        if (force === true) {
            terminal.io.midi.run()
        }
    }

    function resolveDegree(key, scaleIndex, degree) {
        const scale = SCALES[scaleIndex];
        const keyIndex = OCTAVE.indexOf(key);
        let octave = 0;

        degree+=1; // Makes degree calculations easier
        if (degree > scale.length) {
            octave = ~~((degree-1) / scale.length);
            degree = degree % scale.length;
            if (degree == 0) degree = scale.length;
        }

        const noteIndex = scale[degree-1];

        if(keyIndex!=0) {
            // If not C then change ordering of notes
            const keyOctave = OCTAVE.slice(keyIndex,OCTAVE.length).concat(OCTAVE.slice(0,keyIndex))
            if(noteIndex>=(12-keyIndex)) octave += 1; // Shift octave for the last keys.
            return {"note": keyOctave[noteIndex], "octave": octave};
        } else {
            return {"note": OCTAVE[noteIndex], "octave": octave};
        }
    }
}
