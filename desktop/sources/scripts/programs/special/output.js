function program_OUTPUT(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "output"
  this.glyph = "&";
  this.memory = "";

  this.operation = function()
  {
    if(this.left()){
      this.memory += this.left();
    }
  }
}