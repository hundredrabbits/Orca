function program_C(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "copy"
  this.glyph = "c";

  this.operation = function()
  {
    // if(this.left() || this.right()){
    //   pico.program.remove(this.x-1,this.y)
    //   pico.program.remove(this.x+1,this.y)
    //   pico.program.add(this.x-1,this.y+1,this.left())
    //   pico.program.add(this.x,this.y-1,this.left())
    //   pico.program.lock(this.x-1,this.y+1)  
    //   pico.program.lock(this.x,this.y-1)  
    // }

    // if(this.up() || this.down()){
    //   pico.program.add(this.x-1,this.y,this.left())
    //   pico.program.add(this.x+1,this.y,this.left())
    //   pico.program.lock(this.x-1,this.y)  
    //   pico.program.lock(this.x+1,this.y)  
    //   pico.program.remove(this.x,this.y-1)
    //   pico.program.remove(this.x,this.y+1)
    // }
  }
}