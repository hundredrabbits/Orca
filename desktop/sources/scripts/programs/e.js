function program_E(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "explode"
  this.glyph = "e";

  this.operation = function()
  {
    if(!this.neighbor()){
      return;
    }

    var g = this.neighbor().glyph

    pico.program.add(this.x-1,this.y,g);
    pico.program.add(this.x+1,this.y,g);
    pico.program.add(this.x,this.y-1,g);
    pico.program.add(this.x,this.y+1,g);
    this.replace(".")
  }
}