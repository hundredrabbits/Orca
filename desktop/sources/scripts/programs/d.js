function program_D(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "down"
  this.glyph = "d";

  this.operation = function()
  {
    if(!this.is_free(0,1)){ this.replace("b"); this.lock(); return; }
    this.move(0,1);
  }
}