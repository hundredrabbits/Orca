"use strict"

function program_Z(x,y)
{
  Program_Default.call(this,x,y)

  this.name = "creep"
  this.glyph = "z"

  this.operation = function()
  {
    const positions = [{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}]
    const position = positions[pico.f % 4]

    if(this.is_free(position.x,position.y) == true){
      this.move(position.x,position.y)
    }
  }
}