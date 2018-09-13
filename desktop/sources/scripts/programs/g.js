"use strict";

function program_G(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "generator"
  this.glyph = "g";

  this.ports = [{x:0,y:1,output:true},{x:0,y:0,bang:true}]

  this.operation = function()
  {
    if(!this.bang()){ return; }

    pico.program.add(this.x,this.y+1,"d")
  }
}