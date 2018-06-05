function program_E(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "explode"
  this.glyph = "e";

  this.ports = [{x:0,y:0,bang:true}];

  this.operation = function()
  {
    var ns = this.neighbors_unlike(this.glyph);

    if(ns.length < 1 || !this.bang()){
      return;
    }

    for(id in ns){
      var n = ns[id]
      if(n.glyph == "e"){ continue; }
      pico.program.add(this.x-1,this.y,n.glyph);
      pico.program.add(this.x+1,this.y,n.glyph);
      pico.program.add(this.x,this.y-1,n.glyph);
      pico.program.add(this.x,this.y+1,n.glyph);
      this.replace(".")

    }
  }
}