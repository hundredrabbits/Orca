'use strict'

const FnBase = require('./_base')

function FnMove (pico, x, y) {
  FnBase.call(this, pico, x, y)


  this.proceed = function(ahead,behind,paral_g,perpe_g,pos_ahead,move_left,move_across,move_right)
  {
    const wire_ahead = ahead && ahead.glyph == paral_g 
    const wire_behind = behind && (behind.glyph == paral_g || behind.glyph == '*' || behind.glyph == '+')

    // Is On Wire
    if (wire_ahead && wire_behind) {
      pico.add(pos_ahead.x, pos_ahead.y, this.glyph); 
      this.replace(paral_g);
      return true
    } 
    // Entering Wire
    else if (!wire_behind && ahead && (ahead.glyph == '*' || ahead.glyph == '+')) {
      pico.add(move_across.x, move_across.y, move_across.glyph); 
      this.remove(); 
      return true
    }
    // At Splitter
    else if (ahead && ahead.glyph == '*') {
      let eject = true
      // Left Turn
      if (pico.glyph_at(move_left.x, move_left.y) == perpe_g) {
        pico.add(move_left.x,move_left.y,move_left.glyph)
        eject = false
      }
      // Right Turn
      if (pico.glyph_at(move_right.x, move_right.y) == perpe_g) {
        pico.add(move_right.x, move_right.y, move_right.glyph)
        eject = false
      }
      // Exiting
      if (eject || pico.glyph_at(move_across.x, move_across.y) == paral_g) {
        pico.add(move_across.x, move_across.y, move_across.glyph)
      }
      this.replace(paral_g)
      return true
    } 
    else if (ahead && ahead.glyph == '+') {
      // Move across
      if (pico.glyph_at(move_across.x, move_across.y) == paral_g) {
        pico.add(move_across.x, move_across.y, move_across.glyph)
        this.replace(paral_g)
        return true
      }
      // Or, turn clockwise
      else if (pico.glyph_at(move_right.x, move_right.y) == perpe_g) {
        pico.add(move_right.x, move_right.y, move_right.glyph)
        this.replace(paral_g)
        return true
      }
      // Or, turn anti-clockwise
      else if (pico.glyph_at(move_left.x, move_left.y) == perpe_g) {
        pico.add(move_left.x, move_left.y, move_left.glyph)
        this.replace(paral_g)
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
    if (this.glyph == 'e') {
      const pos_ahead = {x:this.x+1,y:this.y}
      const move_left = {x:this.x + 1, y: this.y - 1, glyph:'n'}
      const move_right = {x:this.x + 1, y: this.y + 1, glyph:'s'}
      const move_across = {x:this.x + 2, y: this.y, glyph:this.glyph}
      return this.proceed(e,w,'-','|',pos_ahead,move_left,move_across,move_right)      
    }
    // West Signal
    if (this.glyph == 'w') {
      const pos_ahead = {x:this.x-1,y:this.y}
      const move_left = {x:this.x - 1, y: this.y + 1, glyph:'s'}
      const move_right = {x:this.x - 1, y: this.y - 1, glyph:'n'}
      const move_across = {x:this.x - 2, y: this.y, glyph:this.glyph}
      return this.proceed(w,e,'-','|',pos_ahead,move_left,move_across,move_right)      
    }
    // North Signal
    if (this.glyph == 'n') {
      const pos_ahead = {x:this.x,y:this.y-1}
      const move_left = {x:this.x - 1, y: this.y - 1, glyph:'w'}
      const move_right = {x:this.x + 1, y: this.y - 1, glyph:'e'}
      const move_across = {x:this.x, y: this.y - 2, glyph:this.glyph}
      return this.proceed(n,s,'|','-',pos_ahead,move_left,move_across,move_right)      
    }
    // South Signal
    if (this.glyph == 's') {
      const pos_ahead = {x:this.x,y:this.y+1}
      const move_left = {x:this.x + 1, y: this.y + 1, glyph:'e'}
      const move_right = {x:this.x - 1, y: this.y + 1, glyph:'w'}
      const move_across = {x:this.x, y: this.y + 2, glyph:this.glyph}
      return this.proceed(s,n,'|','-',pos_ahead,move_left,move_across,move_right)      
    }
  }
}

module.exports = FnMove
