function program_I(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "increment"
  this.glyph = "i";
  this.ports = [{x:0,y:0,bang:true},{x:0,y:1,output:true}]

  this.operation = function()
  {
    if(!this.bang()){ return; }
    if(!this.down()){ return; }

    var n = this.down();
    pico.program.add(this.x,this.y+1,this.inc(n.glyph));
  }

  this.inc = function(letter)
  {
    if(parseInt(letter) == 9){ return "0"; }
    if(parseInt(letter) == 0){ return "1"; }
    if(parseInt(letter) > 0){ return parseInt(letter)+1+""; }

    var index = pico.program.glyphs.indexOf(letter);
    
    if(index < 0){ return; }

    return pico.program.glyphs[(index+1) % pico.program.glyphs.length];
  }
}