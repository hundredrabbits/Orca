"use strict";

function program_Y(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "automata"
  this.glyph = "y";

  this.operation = function()
  {
    let ns = this.find_neighbors();

    // Here
  }

  this.find_neighbors = function()
  {
    let ns = []

    if(pico.program.glyph_at(this.x-1,this.y+1) == "y"){ ns.push({x:this.x-1,y:this.y+1}); }
    if(pico.program.glyph_at(this.x,this.y+1) == "y"){ ns.push({x:this.x,y:this.y+1}); }
    if(pico.program.glyph_at(this.x+1,this.y+1) == "y"){ ns.push({x:this.x+1,y:this.y+1}); }
    if(pico.program.glyph_at(this.x-1,this.y) == "y"){ ns.push({x:this.x-1,y:this.y}); }
    if(pico.program.glyph_at(this.x+1,this.y) == "y"){ ns.push({x:this.x+1,y:this.y}); }
    if(pico.program.glyph_at(this.x-1,this.y-1) == "y"){ ns.push({x:this.x-1,y:this.y-1}); }
    if(pico.program.glyph_at(this.x,this.y-1) == "y"){ ns.push({x:this.x,y:this.y-1}); }
    if(pico.program.glyph_at(this.x+1,this.y-1) == "y"){ ns.push({x:this.x+1,y:this.y-1}); }

    return ns
  }
}