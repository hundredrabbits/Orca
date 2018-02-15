function program_G(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "generator"
  this.glyph = "g";

  this.operation = function()
  {
    if(this.neighbors_like("b").length > 0){
      this.fire();
    }
  }
  this.fire = function()
  {
    pico.program.add(this.x,this.y+1,"d")
    pico.program.lock(this.x,this.y+1)  
  }
}