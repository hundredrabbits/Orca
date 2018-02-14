function program_U(x,y)
{
  Program_Default.call(this,x,y);

  this.glyph = "u";

  this.operation = function()
  {
    if(this.is_free(0,-1)){ return; }
    this.move(0,-1);
  }
}