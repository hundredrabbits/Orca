function program_C(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "chain"
  this.glyph = "c";
  this.ports = [{x:0,y:0,bang:true}];

  this.operation = function()
  {
    if(this.bang()){
      this.fire()
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