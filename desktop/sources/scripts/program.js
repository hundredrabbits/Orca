function Program(w,h)
{
  this.w = w;
  this.h = h;
  this.s = "";

  this.locks = [];

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
    if(x < 0 || x > pico.program.w-1 || y < 0 || y > pico.program.h-1 || !glyph){ return; }
    var index = this.index_at(x,y);
    this.s = this.s.substr(0, index)+glyph+this.s.substr(index+glyph.length);
    pico.grid.update();
  }

  this.remove = function(x,y)
  {
    this.add(x,y,".")
  }

  this.run = function()
  {
    this.unlock();

    var y = 0;
    while(y < this.h){
      var x = 0;
      while(x < this.w){
        this.operate(x,y,this.glyph_at(x,y));
        x += 1
      }
      y += 1;
    }
  }

  this.glyph_at = function(x,y)
  {
    return this.s.substr(this.index_at(x,y),1).toLowerCase();
  }

  this.index_at = function(x,y)
  {
    return x + (this.w * y);
  }

  // Locks

  this.is_locked = function(x,y)
  {
    for(id in this.locks){
      var lock = this.locks[id];
      if(lock.x != x || lock.y != y){ continue; }
      return true;
    }
    return false;
  }

  this.unlock = function()
  {
    this.locks = [];
  }

  this.lock = function(x,y)
  {
    this.locks.push({x:x,y:y});
  }

  this.operate = function(x,y,g)
  {
    if(g == "."){ return; }
    if(parseInt(g) > 0){ return; }
    if(!window[`program_${g.toUpperCase()}`]){ console.log(`unknown: program_${g.toUpperCase()}`); return; }
    if(this.is_locked(x,y)){ return; }
    new window[`program_${g.toUpperCase()}`](x,y).run();
  }
}