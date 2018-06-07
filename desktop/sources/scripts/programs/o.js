function program_O(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "odd"
  this.glyph = "o";
  this.ports = [{x:0,y:-1}];

  this.operation = function()
  {
    if(this.up()){
      this.replace("q")
      this.lock();
    }
  }
}