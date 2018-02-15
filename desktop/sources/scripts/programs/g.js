function program_G(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "generator"
  this.glyph = "g";

  this.operation = function()
  {
    if(this.any_neighbor_is("b")){
      this.fire();
    }
  }
  this.fire = function()
  {
    pico.program.add(this.x+1,this.y,"r")
    pico.program.lock(this.x+1,this.y)  
  }
}