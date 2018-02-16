function program_O(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "odd"
  this.glyph = "o";
  this.ports = [{x:0,y:-1}];

  this.operation = function()
  {
    if(this.neighbors_unlike("b").length > 0){
      this.replace("q")
      this.lock();
    }
  }
}