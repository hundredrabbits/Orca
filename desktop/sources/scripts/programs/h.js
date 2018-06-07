function program_H(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "halt"
  this.glyph = "h";

  this.ports = [{x:0,y:1,output:true}]

  this.operation = function()
  {
    pico.program.lock(this.x,this.y+1);
  }
}