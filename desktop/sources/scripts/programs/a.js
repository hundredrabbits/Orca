function program_A(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "add"
  this.glyph = "a";
  this.ports = [{x:-1,y:0},{x:1,y:0},{x:0,y:2,output:true},{x:0,y:0,bang:true}];

  this.operation = function()
  {
    if(!this.bang()){ return; }

    var left = !this.left() ? "0" : this.left().glyph 
    var right = !this.right() ? "0" : this.right().glyph

    var index = (this.convert(left) + this.convert(right)) % pico.program.glyphs.length
    var output = pico.program.glyphs[index]

    pico.program.add(this.x,this.y+2,output);
  }

  this.convert = function(glyph)
  {
    return pico.program.glyphs.indexOf(glyph)
  }

  function is_numeric(glyph)
  {
    return 
  }
}