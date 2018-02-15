function program_H(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "halt"
  this.glyph = "h";

  this.operation = function()
  {
    var n = this.neighbor();

    if(n){
      pico.program.lock(n.x,n.y);
    }
  }
}