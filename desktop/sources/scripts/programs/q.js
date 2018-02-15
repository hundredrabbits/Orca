function program_Q(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "even"
  this.glyph = "q";

  this.operation = function()
  {
    if(this.neighbors_unlike("b").length > 0){
      this.replace("o");
      this.lock();
      this.fire();
    }
  }

  this.fire = function()
  {
    pico.program.add(this.x,this.y+1,"b");
    pico.program.lock(this.x,this.y+1);
  }
}