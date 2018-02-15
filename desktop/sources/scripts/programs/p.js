function program_P(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "push"
  this.glyph = "p";

  this.operation = function()
  {
    var n = this.neighbor();

    if(n){
      pico.program.remove(n.x,n.y)
      pico.program.add(this.x+1,this.y,n.glyph);  
    }
  }
}