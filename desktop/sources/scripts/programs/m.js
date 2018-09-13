"use strict";

function program_M(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "modulo"
  this.glyph = "m";
  this.ports = [{x:-1,y:0},{x:1,y:0},{x:0,y:1,output:true}];

  this.operation = function()
  {
    if(!this.left() || !this.right()){ return; }

    let val = pico.program.glyphs.indexOf(this.left().glyph)
    let mod = pico.program.glyphs.indexOf(this.right().glyph)

    if(mod == 0){ return; }
    
    pico.program.add(this.x,this.y+1,`${parseInt(val) % parseInt(mod)}`);
  }
}