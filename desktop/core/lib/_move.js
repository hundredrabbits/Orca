'use strict'

const FnBase = require('./_base')

function FnMove (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.direction = true

  this.proceed = function (ahead, behind, paralG, perpeG, posAhead, moveLeft, moveAcross, moveRight) {
    const wireAhead = ahead && ahead.glyph === paralG
    const wireBehind = behind && (behind.glyph === paralG || behind.glyph === '~' || behind.glyph === '+')

    // Is On Wire
    if (wireAhead && wireBehind) {
      pico.add(posAhead.x, posAhead.y, this.glyph)
      this.replace(paralG)
      return true
    }
    // Entering Wire
    else if (!wireBehind && ahead && (ahead.glyph === '~' || ahead.glyph === '+')) {
      pico.add(moveAcross.x, moveAcross.y, moveAcross.glyph)
      this.remove()
      return true
    }
    // At Splitter
    else if (ahead && ahead.glyph === '~') {
      let eject = true
      // Left Turn
      if (pico.glyphAt(moveLeft.x, moveLeft.y) === perpeG) {
        pico.add(moveLeft.x, moveLeft.y, moveLeft.glyph)
        eject = false
      }
      // Right Turn
      if (pico.glyphAt(moveRight.x, moveRight.y) === perpeG) {
        pico.add(moveRight.x, moveRight.y, moveRight.glyph)
        eject = false
      }
      // Exiting
      if (eject || pico.glyphAt(moveAcross.x, moveAcross.y) === paralG) {
        pico.add(moveAcross.x, moveAcross.y, moveAcross.glyph)
      }
      this.replace(paralG)
      return true
    } else if (ahead && ahead.glyph === '+') {
      // Move across
      if (pico.glyphAt(moveAcross.x, moveAcross.y) === paralG) {
        pico.add(moveAcross.x, moveAcross.y, moveAcross.glyph)
        this.replace(paralG)
        return true
      }
      // Or, turn clockwise
      else if (pico.glyphAt(moveRight.x, moveRight.y) === perpeG) {
        pico.add(moveRight.x, moveRight.y, moveRight.glyph)
        this.replace(paralG)
        return true
      }
      // Or, turn anti-clockwise
      else if (pico.glyphAt(moveLeft.x, moveLeft.y) === perpeG) {
        pico.add(moveLeft.x, moveLeft.y, moveLeft.glyph)
        this.replace(paralG)
        return true
      }
    }
    return false
  }

  this.signal = function () {
    const e = this.east()
    const w = this.west()
    const n = this.north()
    const s = this.south()

    // East Signal
    if (this.glyph === 'e') {
      const posAhead = { x: this.x + 1, y: this.y }
      const moveLeft = { x: this.x + 1, y: this.y - 1, glyph: 'n' }
      const moveRight = { x: this.x + 1, y: this.y + 1, glyph: 's' }
      const moveAcross = { x: this.x + 2, y: this.y, glyph: this.glyph }
      return this.proceed(e, w, '-', '|', posAhead, moveLeft, moveAcross, moveRight)
    }
    // West Signal
    if (this.glyph === 'w') {
      const posAhead = { x: this.x - 1, y: this.y }
      const moveLeft = { x: this.x - 1, y: this.y + 1, glyph: 's' }
      const moveRight = { x: this.x - 1, y: this.y - 1, glyph: 'n' }
      const moveAcross = { x: this.x - 2, y: this.y, glyph: this.glyph }
      return this.proceed(w, e, '-', '|', posAhead, moveLeft, moveAcross, moveRight)
    }
    // North Signal
    if (this.glyph === 'n') {
      const posAhead = { x: this.x, y: this.y - 1 }
      const moveLeft = { x: this.x - 1, y: this.y - 1, glyph: 'w' }
      const moveRight = { x: this.x + 1, y: this.y - 1, glyph: 'e' }
      const moveAcross = { x: this.x, y: this.y - 2, glyph: this.glyph }
      return this.proceed(n, s, '|', '-', posAhead, moveLeft, moveAcross, moveRight)
    }
    // South Signal
    if (this.glyph === 's') {
      const posAhead = { x: this.x, y: this.y + 1 }
      const moveLeft = { x: this.x + 1, y: this.y + 1, glyph: 'e' }
      const moveRight = { x: this.x - 1, y: this.y + 1, glyph: 'w' }
      const moveAcross = { x: this.x, y: this.y + 2, glyph: this.glyph }
      return this.proceed(s, n, '|', '-', posAhead, moveLeft, moveAcross, moveRight)
    }
  }
}

module.exports = FnMove
