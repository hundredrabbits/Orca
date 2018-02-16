function program_A(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "add"
  this.glyph = "a";
  this.ports = [{x:-1,y:0},{x:1,y:0},{x:0,y:2,output:true}];

  this.operation = function()
  {
    if(this.left() && this.right()){
      var sum = parseFloat(this.left().glyph) + parseFloat(this.right().glyph)
      var index = parseInt(sum) % pico.program.glyphs.length;

      pico.program.add(this.x,this.y+2,pico.program.glyphs[index]);
    }
  }
}