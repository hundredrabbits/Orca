function program_N(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "turn"
  this.glyph = "n";
  this.ports = [{x:0,y:1,output:true}];

  this.operation = function()
  {
    pico.program.add(this.x,this.y+1,(pico.f % 9)+"");
  }
}