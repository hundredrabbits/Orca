function Program_Default(x,y)
{
  this.x = x;
  this.y = y;
  this.glyph = "."

  this.pre = function()
  {
  }

  this.run = function()
  {
    this.pre();
    this.operation();
    this.post();
  }

  this.post = function()
  {
    if(this.x < 0 || this.x > pico.program.w-1 || this.y < 0 || this.y > pico.program.h-1){ 
      pico.program.lock(this.x,this.y);
      pico.program.remove(this.x,this.y);
    }    
  }

  this.operation = function()
  {
    
  }

  this.move = function(x,y,g)
  {
    pico.program.lock(this.x+x,this.y+y);
    pico.program.remove(this.x,this.y);
    pico.program.add(this.x+x,this.y+y,this.glyph); 
  }

  this.is_free = function(x,y)
  {
    return pico.program.glyph_at(this.x+x,this.y+y) != "."
  }
}