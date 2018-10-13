'use strict'

const FnBase = require('./_base')

function FnMove (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.on_wire = function(e,w,n,s)
  {
    if(this.glyph == "e"){ this.replace("-"); pico.add(this.x+1,this.y,this.glyph) }
    else if(this.glyph == "w"){ this.replace("-"); pico.add(this.x-1,this.y,this.glyph) }
    else if(this.glyph == "n"){ this.replace("-"); pico.add(this.x,this.y-1,this.glyph) }
    else if(this.glyph == "s"){ this.replace("-"); pico.add(this.x,this.y+1,this.glyph) }
    return true
  }

  this.on_enter = function(e,w,n,s)
  {
    if(this.glyph == "e" && !w){ this.remove(); pico.add(this.x+2,this.y,this.glyph) }
    else if(this.glyph == "w" && !e){ this.remove(); pico.add(this.x-2,this.y,this.glyph) }
    else if(this.glyph == "n" && !w){ this.remove(); pico.add(this.x,this.y-2,this.glyph) }
    else if(this.glyph == "s" && !e){ this.remove(); pico.add(this.x,this.y+2,this.glyph) }
    return true
  }

  this.on_exit = function(e,w,n,s)
  {
    if(this.glyph == "e" && w && w.glyph == "-"){ this.replace("-"); pico.add(this.x+2,this.y,this.glyph) }
    else if(this.glyph == "w" && e && e.glyph == "-"){ this.replace("-"); pico.add(this.x-2,this.y,this.glyph) }
    else if(this.glyph == "n" && s && s.glyph == "|"){ this.replace("|"); pico.add(this.x,this.y-2,this.glyph) }
    else if(this.glyph == "s" && n && n.glyph == "|"){ this.replace("|"); pico.add(this.x,this.y+2,this.glyph) }
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

    // East Signal
    if(this.glyph == "e"){
      if(e && e.glyph == "-"){
        if(w && (w.glyph == "-" || w.glyph == "*")){
          return this.on_wire(e,w,n,s);
        }
      }
      else if(e && e.glyph == "*"){
        if(w && w.glyph == "-"){
          return this.on_exit(e,w,n,s);
        }
        else if(!w){
          return this.on_enter(e,w,n,s);
        }
      }
    }



  }
}

module.exports = FnMove
