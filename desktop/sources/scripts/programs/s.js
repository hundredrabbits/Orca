function program_S(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "shift"
  this.glyph = "s";
  this.ports = [{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0}];

  this.operation = function()
  {
    var n = this.neighbor();
    
    if(!n){ return; }

    if(this.up()){
      pico.program.add(this.x,this.y-1,"u");
    }
    if(this.down()){
      pico.program.add(this.x,this.y+1,"d");
    }
    if(this.left()){
      pico.program.add(this.x-1,this.y,"l");
    }
    if(this.right()){
      pico.program.add(this.x+1,this.y,"r");
    }
  }
}