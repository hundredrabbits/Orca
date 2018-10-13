'use strict'

const FnBase = require('./_base')

function FnMove (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.enter_wire = function(e,w,n,s)
  {
    if(this.glyph == "e"){

    }
  }

  this.on_wire = function(e,w,n,s){

  }

  this.on_enter = function(e,w,n,s)
  {
    if(this.glyph == "e"){ this.replace("-"); pico.add(this.x+1,this.y,this.glyph) }
    else if(this.glyph == "w"){ this.replace("-"); pico.add(this.x-1,this.y,this.glyph) }
    else if(this.glyph == "n"){ this.replace("-"); pico.add(this.x,this.y-1,this.glyph) }
    else if(this.glyph == "s"){ this.replace("-"); pico.add(this.x,this.y+1,this.glyph) }
    return true
  }

  this.on_intersection = function(e,w,n,s)
  {
    if(this.glyph == "e" && !w){ this.remove(); pico.add(this.x+2,this.y,this.glyph) }
    else if(this.glyph == "w" && !e){ this.remove(); pico.add(this.x-2,this.y,this.glyph) }
    else if(this.glyph == "n" && !w){ this.remove(); pico.add(this.x,this.y-2,this.glyph) }
    else if(this.glyph == "s" && !e){ this.remove(); pico.add(this.x,this.y+2,this.glyph) }
    return true
  }

  this.signal = function()
  {
    const e = this.east()
    const w = this.west()
    const n = this.north()
    const s = this.south()

    // Wiring
    if(this.glyph == "e" && e && e.glyph == "-" && w && w.glyph == "*"){
      return this.on_wire(e,w,n,s);
    }

    // Entering
    if(this.glyph == "e" && e && e.glyph == "-" && w && w.glyph == "*" || this.glyph == "w" && w && w.glyph == "-" && e && e.glyph == "*" || this.glyph == "n" && n && n.glyph == "|" && s && s.glyph == "*" || this.glyph == "s" && s && s.glyph == "|" && n && n.glyph == "*"){
      return this.on_enter(e,w,n,s)
    }
    // Intersecting
    if(this.glyph == "e" && e && e.glyph == "*" || this.glyph == "w" && w && w.glyph == "*" || this.glyph == "n" && n && n.glyph == "*" || this.glyph == "s" && s && s.glyph == "*"){
      return this.on_intersection(e,w,n,s)
    }
  }
}

module.exports = FnMove
