"use strict"

function program_X(x,y)
{
  Program_Default.call(this,x,y)

  this.name = "split"
  this.glyph = "x"
  this.ports = [{x:-1,y:0},{x:0,y:1,output:true},{x:1,y:0,output:true}]

  this.operation = function()
  {
    if(this.left("0")){
      this.fire(1,0)
    }
    if(this.left("1")){
      this.fire(0,1)
    }
  }

  this.fire = function(x,y)
  {
    pico.program.add(this.x+x,this.y+y,"b")
    pico.program.lock(this.x+x,this.y+y)
  }
}