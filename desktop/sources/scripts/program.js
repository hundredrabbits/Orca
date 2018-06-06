function Program(w,h)
{
  this.w = w;
  this.h = h;
  this.s = "";

  this.locks = [];
  this.ports = [];
  this.glyphs = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",".","1","2","3","4","5","6","7","8","9","0"];

  this.reset = function()
  {
    this.s = "";
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
    this.ports = [];

    var y = 0;
    while(y < this.h){
      var x = 0;
      while(x < this.w){
        this.operate(x,y,this.glyph_at(x,y));
        x += 1
      }
      y += 1;
    }

    this.s = this.s.substr(0,this.w*this.h)
  }

  this.glyph_at = function(x,y,req = null)
  {
    var s = this.s.substr(this.index_at(x,y),1).toLowerCase();
    return req && req == s || !req ? s : "."
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

  this.output = function()
  {
    return this.s.substr(this.s.length-1,1)
  }

  this.operate = function(x,y,g)
  {
    if(g == "."){ return; }
    if(g == "0"){ return; }
    if(parseInt(g) > 0){ return; }
    if(!window[`program_${g.toUpperCase()}`]){ console.log(`unknown: program_${g.toUpperCase()}`); return; }
    if(this.is_locked(x,y) == true){ return; }
    new window[`program_${g.toUpperCase()}`](x,y).run();
  }

  this.debug = function()
  {
    var s = "";

    for(id in this.glyphs){
      var g = this.glyphs[id];
      if(window[`program_${g.toUpperCase()}`]){
        var program = new window[`program_${g.toUpperCase()}`]();
        s += `${g}: ${program.docs()}\n`;
      }
      else{
        s += `${g}: Missing\n`;
      }
    }
    console.log(s)
  }
}