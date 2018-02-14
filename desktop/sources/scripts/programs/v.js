function program_V(x,y)
{
  Program_Default.call(this,x,y);

  this.glyph = "v";

  this.operation = function()
  {
    if(pico.program.glyph_at(this.x-1,this.y) != "."){
      var g = pico.program.glyph_at(this.x-1,this.y);
      pico.program.remove(this.x-1,this.y)
      pico.program.add(this.x,this.y+1,"D")
    }
  }
}