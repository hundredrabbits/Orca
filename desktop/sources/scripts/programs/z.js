"use strict";

function program_Z(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "creep"
  this.glyph = "z";

  this.operation = function()
  {
    let positions = [{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}];
    let position = positions[pico.f % 4];

    if(this.is_free(position.x,position.y) == true){
      this.move(position.x,position.y)
    }
  }
}