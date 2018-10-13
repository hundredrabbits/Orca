'use strict'

const FnBase = require('./_base')

function FnMove (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.signal = function()
  {
    const e = this.east()
    const w = this.west()
    const n = this.north()
    const s = this.south()

    // End of Wire
    if(this.glyph == "e" && e && e.glyph == "*"){
      if(!w){
        this.remove()
      }
      else{
        pico.add(this.x,this.y,'-')
      }
      pico.add(this.x+2,this.y,this.glyph)
      return true
    }

    // Along the wire(horizontal)
    if(e && e.glyph == "-" && w && (w.glyph == "-" || w.glyph == "*")){
      const mod = this.glyph == "e" ? 1 : -1
      pico.add(this.x,this.y,'-')
      pico.add(this.x+mod,this.y,this.glyph)
      pico.lock(this.x+mod,this.y)
      return true
    }
    // Along the wire(vertical)
    if(s && s.glyph == "|" && n && (n.glyph == "|" || n.glyph == "*")){
      const mod = this.glyph == "s" ? 1 : -1
      pico.add(this.x,this.y,'|')
      pico.add(this.x,this.y+mod,this.glyph)
      pico.lock(this.x,this.y+mod)
      return true
    }
    return false
  }
}

module.exports = FnMove
