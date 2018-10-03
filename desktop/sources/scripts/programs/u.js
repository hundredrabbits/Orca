"use strict"

function program_U(x,y)
{
  Program_Default.call(this,x,y)

  this.name = "up"
  this.glyph = "u"

  this.operation = function()
  {
    if(this.is_free(0,-1) != true){ this.replace("b"); this.lock(); return; }
    this.move(0,-1)
  }
}