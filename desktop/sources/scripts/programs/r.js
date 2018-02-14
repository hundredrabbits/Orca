function program_R(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "right"
  this.glyph = "r";

  this.operation = function()
  {
    if(this.is_free(1,0)){ return; }
    this.move(1,0);
  }
}