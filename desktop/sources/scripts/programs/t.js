function program_T(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "trigger"
  this.glyph = "t";
  this.ports = [{x:0,y:-1},{x:0,y:1,output:true}];

  this.operation = function()
  {
    if(this.up("1") || this.up("r") || this.up("l") || this.up("u") || this.up("d") || this.up("b") || this.up("z")){
      this.fire();
    }
  }

  this.fire = function()
  {
    pico.program.add(this.x,this.y+1,"b");
    pico.program.lock(this.x,this.y+1);
  }
}