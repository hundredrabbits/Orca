"use strict";

function program_J(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "jump"
  this.glyph = "j";

  this.ports = [{x:-1,y:0},{x:1,y:0,output:true},{x:0,y:0,bang:true}]

  this.operation = function()
  {
    // pico.program.lock(this.x+1,this.y)
    pico.program.lock(this.x-1,this.y)
    if(this.bang() && this.left()){
      this.fire();
    }
  }
  this.fire = function()
  {
    pico.program.add(this.x+1,this.y,this.left().glyph)
    pico.program.remove(this.x-1,this.y)  
    pico.program.lock(this.x+1,this.y)
    pico.program.lock(this.x-1,this.y)
  }
}