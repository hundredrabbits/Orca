"use strict";

function program_S(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "shift"
  this.glyph = "s";
  this.ports = [{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0}];

  this.operation = function()
  {
    if(this.up() && this.up().glyph != 'u'){
      pico.program.add(this.x,this.y-1,"u");
      pico.program.lock(this.x,this.y-1)
    }
    if(this.down() && this.down().glyph != 'd'){
      pico.program.add(this.x,this.y+1,"d");
      pico.program.lock(this.x,this.y+1)
    }
    if(this.left() && this.left().glyph != 'l'){
      pico.program.add(this.x-1,this.y,"l");
      pico.program.lock(this.x-1,this.y)
    }
    if(this.right() && this.right().glyph != 'r'){
      pico.program.add(this.x+1,this.y,"r");
      pico.program.lock(this.x+1,this.y)
    }
  }
}