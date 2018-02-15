function program_T(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "trigger"
  this.glyph = "t";

  this.operation = function()
  {
    var n = this.any_neighbor_is("0");
    if(n){
      this.fire();
      pico.program.add(n.x,n.y,"1");
    }
  }

  this.fire = function()
  {
    var ns = this.free_neighbors();
    for(id in ns){
      var n = ns[id];
      pico.program.add(n.x,n.y,"b");
      pico.program.lock(n.x,n.y);
    }
  }
}