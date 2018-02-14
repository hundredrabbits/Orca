function program_C(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "clone"
  this.glyph = "c";

  this.operation = function()
  {
    if(this.left()){
      this.replace(this.left())
    }
    if(this.right()){
      this.replace(this.right())
    }
    if(this.up()){
      this.replace(this.up())
    }
    if(this.down()){
      this.replace(this.down())
    }
  }
}