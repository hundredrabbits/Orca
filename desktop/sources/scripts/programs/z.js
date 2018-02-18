function program_Z(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "random"
  this.glyph = "z";

  this.operation = function()
  {
    var positions = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
    var position = positions[Math.floor(Math.random()*positions.length)];

    if(this.is_free(position.x,position.y)){
      this.move(position.x,position.y)
    }
  }
}