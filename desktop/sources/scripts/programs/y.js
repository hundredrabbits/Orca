function program_Y(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "automata"
  this.glyph = "y";

  this.operation = function()
  {
    var ns = this.neighbors_like("y")

    // Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
    if(ns.length == 1){
      this.remove();
    }
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    else if(ns.length == 4){
      this.remove();
    }
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    else if(ns.length == 3){
      var growth = this.free_neighbors()[0];
      if(growth.length > 0){
        this.remove();
        this.lock();
        pico.program.add(growth.x,growth.y,this.glyph)
        pico.program.lock(this.x+growth.x,this.y+growth.y) 
      }
    }
  }
}