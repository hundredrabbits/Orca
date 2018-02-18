function program_M(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "modulo"
  this.glyph = "m";
  this.ports = [{x:-1,y:0},{x:1,y:0},{x:0,y:1,output:true},{x:0,y:0,bang:true}];

  this.operation = function()
  {
    if(this.left() && this.right() && this.bang()){
      var mod = parseInt(this.left().glyph) > 0 ? this.left().glyph : pico.program.glyphs.indexOf(this.left().glyph) % 9;
      var val = parseInt(this.right().glyph) > 0 ? this.right().glyph : pico.program.glyphs.indexOf(this.right().glyph) % 9;
      pico.program.add(this.x,this.y+1,`${val % mod}`);
      this.lock();
    }
  }
}