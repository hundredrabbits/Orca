function Program(w,h)
{
  this.w = w;
  this.h = h;
  this.s = "";

  this.reset = function()
  {
    var y = 0;
    while(y < this.h){
      var x = 0;
      while(x < this.w){
        this.s += "."
        x += 1
      }
      y += 1;
    }
  }

  this.add = function(x,y,glyph)
  {
    var index = this.index_at(x,y);
    this.s = this.s.substr(0, index)+glyph+this.s.substr(index+glyph.length);
    pico.grid.update();
  }

  this.run = function()
  {
    for(id in this.cells){
      var cell = this.cells[id];
      cell.run();
    }
  }

  this.glyph_at = function(x,y)
  {
    return this.s.substr(this.index_at(x,y),1);
  }

  this.index_at = function(x,y)
  {
    return x + (this.w * y);
  }
}