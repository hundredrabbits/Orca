function program_X(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "split"
  this.glyph = "x";

  this.operation = function()
  {
    if(this.left("0")){
      pico.program.remove(this.x-1,this.y);
      this.fire(1,0)
    }
    if(this.left("1")){
      pico.program.remove(this.x-1,this.y);
      this.fire(0,1)
    }
  }

  this.fire = function(x,y)
  {
    pico.program.add(this.x+x,this.y+y,"b");
    pico.program.lock(this.x+x,this.y+y);
  }
}