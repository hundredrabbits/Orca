function program_R(x,y)
{
  Program_Default.call(this,x,y);

  this.glyph = "R";

  this.operation = function()
  {
    pico.program.lock(this.x+1,this.y);
    pico.program.remove(this.x,this.y);
    pico.program.add(this.x+1,this.y,"R"); 
  }
}