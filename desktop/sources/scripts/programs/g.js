function program_G(x,y)
{
  Program_Default.call(this,x,y);

  this.glyph = "g";

  this.operation = function()
  {
    if(pico.f % 40 == 0){
      pico.program.add(this.x+1,this.y,"r")
      pico.program.lock(this.x+1,this.y)  
    }
  }
}