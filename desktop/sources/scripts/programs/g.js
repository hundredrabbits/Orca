function program_G(x,y)
{
  Program_Default.call(this,x,y);

  this.glyph = "G";

  this.operation = function()
  {
    if(pico.f % 10 == 0){
      pico.program.add(this.x+1,this.y,"R")
      pico.program.lock(this.x+1,this.y)  
    }
  }
}