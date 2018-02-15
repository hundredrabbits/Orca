function program_F(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "if"
  this.glyph = "f";

  this.operation = function()
  {
    if(!this.left() || !this.right()){ return; }
  
    if(this.left().glyph == this.right().glyph){
      pico.program.add(this.x,this.y+1,"b");
      pico.program.lock(this.x,this.y+1);
    }
  }
}