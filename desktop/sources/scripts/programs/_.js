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
    
  }

  this.operation = function()
  {
    
  }
}