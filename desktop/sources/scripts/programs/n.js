function program_N(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "numeric"
  this.glyph = "n";

  this.operation = function()
  {
    var n = this.neighbor();

    if(n && !this.is_numeric(n.glyph)){
      pico.program.add(n.x,n.y,"1");  
    }
  }

  this.is_numeric = function(n)
  {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}