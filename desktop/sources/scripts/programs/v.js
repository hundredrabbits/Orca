"use strict";

function program_V(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "value"
  this.glyph = "v";
  this.ports = [{x:-1,y:0},{x:-2,y:0},{x:-3,y:0},{x:-4,y:0},{x:-5,y:0}];

  this.operation = function()
  {
    let val = 0;

    val += pico.program.glyph_at(this.x-1,this.y) != "." ? 1 : 0;
    val += pico.program.glyph_at(this.x-2,this.y) != "." ? 1 : 0;
    val += pico.program.glyph_at(this.x-3,this.y) != "." ? 1 : 0;
    val += pico.program.glyph_at(this.x-4,this.y) != "." ? 1 : 0;
    val += pico.program.glyph_at(this.x-5,this.y) != "." ? 1 : 0;
    pico.program.add(this.x+1,this.y,val+"");
    pico.program.lock(this.x+1,this.y);
  }
}