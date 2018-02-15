function program_M(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "modulo"
  this.glyph = "m";

  this.operation = function()
  {
    if(this.left() && this.right()){
      var mod = parseInt(this.left().glyph) > 0 ? this.left().glyph : pico.program.glyphs.indexOf(this.left().glyph) % 9;
      var val = parseInt(this.right().glyph) > 0 ? this.right().glyph : pico.program.glyphs.indexOf(this.right().glyph) % 9;
      pico.program.add(this.x,this.y+1,`${val % mod}`);
      this.lock();
    }
  }
}