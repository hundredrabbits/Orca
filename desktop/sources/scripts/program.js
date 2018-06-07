function Program(w,h)
{
  this.size = {h:40,v:30}
  this.w = w;
  this.h = h;
  this.s = "";
  this.r = ""; // Record

  this.locks = [];
  this.progs = [];
  this.glyphs = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","."];


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
    this.progs = [] 

    // Find Programs
    var y = 0;
    while(y < this.h){
      var x = 0;
      while(x < this.w){
        var g = this.glyph_at(x,y)
        if(this.is_prog(g)){
          this.progs.push(new window[`program_${g.toUpperCase()}`](x,y))
        }
        x += 1
      }
      y += 1;
    }

    // Operate
    for(id in this.progs){
      var p = this.progs[id]
      if(this.is_locked(p.x,p.y)){ continue; }
      p.run()
    }

    this.record();

    this.s = this.s.substr(0,this.w*this.h)
  }

  this.is_prog = function(g)
  {
    return this.glyphs.indexOf(g) >= 9 && this.glyphs.indexOf(g) <= 35 && window[`program_${g.toUpperCase()}`]
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
    return this.locks.indexOf(`${x}:${y}`) > -1;
  }

  this.unlock = function()
  {
    this.locks = [];
  }

  this.lock = function(x,y)
  {
    this.locks.push(`${x}:${y}`);
  }

  this.output = function()
  {
    return this.s.substr(this.s.length-1,1)
  }

  this.record = function()
  {
    var g = this.s.substr(-1,1)
    var last_g = this.r.substr(-1,1)
    if(g == "." && last_g == "."){ return; }
    this.r += g;

    // Trim
    if(this.r.length >= pico.program.size.h){
      this.r = this.r.substr(-pico.program.size.h+1,pico.program.size.h)
    }
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