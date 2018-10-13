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

    // East Signal
    if(this.glyph == "e"){
      if(e && e.glyph == "-"){
        if(w && (w.glyph == "-" || w.glyph == "*")){
          pico.add(this.x+1,this.y,this.glyph); this.replace("-"); return true
        }
      }
      else if(e && e.glyph == "*"){
        if(w && w.glyph == "-"){
          let eject = true
          // Move North
          if(pico.glyph_at(this.x+1,this.y-1) == "|"){
            pico.add(this.x+1,this.y-1,"n");
            eject = false
          }
          // Move South
          if(pico.glyph_at(this.x+1,this.y+1) == "|"){
            pico.add(this.x+1,this.y+1,"s");
            eject = false
          }
          // Exit
          if(eject){
            pico.add(this.x+2,this.y,this.glyph);  
          }
          this.replace("-"); 
          return true
        }
        else if(!w){
          this.remove(); pico.add(this.x+2,this.y,this.glyph); return true
        }
      }
    }

    // West Signal
    if(this.glyph == "w"){
      if(w && w.glyph == "-"){
        if(e && (e.glyph == "-" || e.glyph == "*")){
          pico.add(this.x-1,this.y,this.glyph); this.replace("-"); return true
        }
      }
      else if(w && w.glyph == "*"){
        if(e && e.glyph == "-"){
          let eject = true
          // Move North
          if(pico.glyph_at(this.x-1,this.y-1) == "|"){
            pico.add(this.x-1,this.y-1,"n");
            eject = false
          }
          // Move South
          if(pico.glyph_at(this.x-1,this.y+1) == "|"){
            pico.add(this.x-1,this.y+1,"s");
            eject = false
          }
          // Exit
          if(eject){
            pico.add(this.x-2,this.y,this.glyph);  
          }
          this.replace("-"); 
          return true
        }
        else if(!e){
          this.remove(); pico.add(this.x-2,this.y,this.glyph); return true
        }
      }
    }

    // North Signal
    if(this.glyph == "n"){
      if(n && n.glyph == "|"){
        if(s && (s.glyph == "|" || s.glyph == "*")){
          pico.add(this.x,this.y-1,this.glyph); this.replace("|"); return true
        }
      }
      else if(n && n.glyph == "*"){
        if(s && s.glyph == "|"){
          let eject = true
          // Move North
          if(pico.glyph_at(this.x+1,this.y-1) == "-"){
            pico.add(this.x+1,this.y-1,"e");
            eject = false
          }
          // Move South
          if(pico.glyph_at(this.x-1,this.y-1) == "-"){
            pico.add(this.x-1,this.y-1,"w");
            eject = false
          }
          // Exit
          if(eject){
            pico.add(this.x,this.y-2,this.glyph);  
          }
          this.replace("|");
          return true
        }
        else if(!s){
          // Enter wire
          this.remove(); pico.add(this.x,this.y-2,this.glyph); return true
        }
      }
    }

    // South Signal
    if(this.glyph == "s"){
      if(s && s.glyph == "|"){
        if(n && (n.glyph == "|" || n.glyph == "*")){
          pico.add(this.x,this.y+1,this.glyph); this.replace("|"); return true
        }
      }
      else if(s && s.glyph == "*"){
        if(n && n.glyph == "|"){
          let eject = true
          // Move North
          if(pico.glyph_at(this.x+1,this.y+1) == "-"){
            pico.add(this.x+1,this.y+1,"e");
            eject = false
          }
          // Move South
          if(pico.glyph_at(this.x-1,this.y+1) == "-"){
            pico.add(this.x-1,this.y+1,"w");
            eject = false
          }
          // Exit
          if(eject){
            pico.add(this.x,this.y+2,this.glyph);  
          }
          this.replace("|"); 
          return true
        }
        else if(!n){
          this.remove(); pico.add(this.x,this.y+2,this.glyph); return true
        }
      }
    }

  }
}

module.exports = FnMove
