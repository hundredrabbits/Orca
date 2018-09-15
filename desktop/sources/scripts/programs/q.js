"use strict";

function program_Q(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "even"
  this.glyph = "q";
  this.ports = [{x:0,y:0,bang:true},{x:0,y:1,output:true}];

  this.operation = function()
  {
    if(!this.bang()){ return; }

    this.replace("o");
    this.lock();
    pico.program.add(this.x,this.y+1,"b");
    pico.program.lock(this.x,this.y+1);
  }
}