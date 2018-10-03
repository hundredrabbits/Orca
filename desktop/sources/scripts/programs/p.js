"use strict"

function program_P(x,y)
{
  Program_Default.call(this,x,y)

  this.name = "push"
  this.glyph = "p"
  this.ports = [{x:0,y:0,bang:true}]

  this.operation = function()
  {
    const origin = this.bang()

    if(!origin){ return; }

    const direction = {x:this.x-origin.x,y:this.y-origin.y}
    const pushed = this.neighbor_by(direction.x,direction.y)
    
    this.move(direction.x,direction.y)

    if(pushed){
      pico.program.add(this.x+(direction.x*2),this.y+(direction.y*2),pushed.glyph)
    }
  }

  this.n_offset = function(pos)
  {
    return {x:this.x-pos.x,y:this.y-pos.y}
  }
}