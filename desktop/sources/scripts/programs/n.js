function program_N(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "numeric"
  this.glyph = "n";

  this.operation = function()
  {
    var n = this.neighbor();

    if(n && !this.is_numeric(n.glyph)){
      var val = parseInt(n.glyph) > 0 ? n.glyph : "1";
      pico.program.add(n.x,n.y,val);  
    }
  }

  this.is_numeric = function(n)
  {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}