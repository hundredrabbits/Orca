function program_P(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "push"
  this.glyph = "p";
  this.ports = [{x:0,y:0,bang:true},];

  this.operation = function()
  {
    var n = this.bang();

    if(n){
      var pos = this.n_offset(n)
      this.move(pos.x,pos.y);
    }
  }

  this.n_offset = function(pos)
  {
    return {x:this.x-pos.x,y:this.y-pos.y}
  }
}