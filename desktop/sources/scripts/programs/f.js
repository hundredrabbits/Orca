"use strict"

function program_F(x,y)
{
  Program_Default.call(this,x,y)

  this.name = "if"
  this.glyph = "f"
  this.ports = [{x:-1,y:0},{x:1,y:0},{x:0,y:1,output:true}]

  this.operation = function()
  {
    if(!this.left() || !this.right()){ return; }
    
    if(this.left(this.right().glyph)){
      pico.program.add(this.x,this.y+1,"1")
    }
    else{
      pico.program.add(this.x,this.y+1,"0")
    }
  }
}