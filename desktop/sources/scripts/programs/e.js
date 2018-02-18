function program_E(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "explode"
  this.glyph = "e";

  this.operation = function()
  {
    var ns = this.neighbors_unlike(this.glyph);

    if(ns.length < 1){
      return;
    }

    var g = ns[0].glyph

    pico.program.add(this.x-1,this.y,g);
    pico.program.add(this.x+1,this.y,g);
    pico.program.add(this.x,this.y-1,g);
    pico.program.add(this.x,this.y+1,g);
    this.replace(".")
  }
}