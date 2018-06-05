function Program_Default(x,y)
{
  this.name = "<missing name>"
  this.x = x;
  this.y = y;
  this.glyph = "."
  this.ports = []

  this.id = function()
  {
    return this.x + (this.y * pico.program.h)
  }

  this.pre = function()
  {
  }

  this.run = function()
  {
    this.pre();
    this.operation();
    this.post();
  }

  this.post = function()
  {
    if(this.x < 0 || this.x > pico.program.w-1 || this.y < 0 || this.y > pico.program.h-1){ 
      this.lock();
      pico.program.remove(this.x,this.y);
    }

    for(id in this.ports){
      var port = this.ports[id];
      pico.program.ports.push({x:this.x+port.x,y:this.y+port.y,output:port.output,bang:port.bang});  
    }
  }

  this.operation = function()
  {
    
  }

  this.remove = function()
  {
    this.replace(".")
  }

  this.replace = function(g)
  {
    this.lock();
    pico.program.add(this.x,this.y,g)
  }

  this.lock = function()
  {
    pico.program.lock(this.x,this.y);
  }

  this.move = function(x,y,g)
  {
    pico.program.lock(this.x+x,this.y+y);
    pico.program.remove(this.x,this.y);
    pico.program.add(this.x+x,this.y+y,this.glyph); 
  }

  this.is_free = function(x,y)
  {
    return pico.program.glyph_at(this.x+x,this.y+y) == "." ? true : pico.program.glyph_at(this.x+x,this.y+y)
  }

  this.neighbor = function()
  {
    if(pico.program.glyph_at(this.x+1,this.y) != "."){ return {x:this.x+1,y:this.y,glyph:pico.program.glyph_at(this.x+1,this.y)}; }
    if(pico.program.glyph_at(this.x-1,this.y) != "."){ return {x:this.x-1,y:this.y,glyph:pico.program.glyph_at(this.x-1,this.y)}; }
    if(pico.program.glyph_at(this.x,this.y+1) != "."){ return {x:this.x,y:this.y+1,glyph:pico.program.glyph_at(this.x,this.y+1)}; }
    if(pico.program.glyph_at(this.x,this.y-1) != "."){ return {x:this.x,y:this.y-1,glyph:pico.program.glyph_at(this.x,this.y-1)}; } 
    return null;   
  }

  this.neighbors = function()
  {
    var a = [];
    if(pico.program.glyph_at(this.x+1,this.y) != "."){ a.push({x:this.x+1,y:this.y,glyph:pico.program.glyph_at(this.x+1,this.y)}); }
    if(pico.program.glyph_at(this.x-1,this.y) != "."){ a.push({x:this.x-1,y:this.y,glyph:pico.program.glyph_at(this.x-1,this.y)}); }
    if(pico.program.glyph_at(this.x,this.y+1) != "."){ a.push({x:this.x,y:this.y+1,glyph:pico.program.glyph_at(this.x,this.y+1)}); }
    if(pico.program.glyph_at(this.x,this.y-1) != "."){ a.push({x:this.x,y:this.y-1,glyph:pico.program.glyph_at(this.x,this.y-1)}); } 
    return a;
  }

  this.neighbors_like = function(g)
  {
    var a = [];
    if(this.up(g)){ a.push(this.up(g)); }
    if(this.right(g)){ a.push(this.right(g)); } 
    if(this.down(g)){ a.push(this.down(g)); }
    if(this.left(g)){ a.push(this.left(g)); }
    return a;
  }

  this.neighbors_unlike = function(g)
  {
    var a = [];
    if(this.up() && this.up().glyph != g){ a.push(this.up()); }
    if(this.right() && this.right().glyph != g){ a.push(this.right()); } 
    if(this.down() && this.down().glyph != g){ a.push(this.down()); }
    if(this.left() && this.left().glyph != g){ a.push(this.left()); }
    return a;
  }

  this.free_neighbors = function()
  {
    var a = [];
    if(pico.program.glyph_at(this.x+1,this.y) == "."){ a.push({x:this.x+1,y:this.y}); }
    if(pico.program.glyph_at(this.x-1,this.y) == "."){ a.push({x:this.x-1,y:this.y}); }
    if(pico.program.glyph_at(this.x,this.y+1) == "."){ a.push({x:this.x,y:this.y+1}); }
    if(pico.program.glyph_at(this.x,this.y-1) == "."){ a.push({x:this.x,y:this.y-1}); } 
    return a;
  }

  this.any_neighbor_is = function(glyph)
  {
    var ns = this.neighbors();
    for(id in ns){
      var n = ns[id];
      if(n.glyph == glyph){
        return n;
      }
    }
    return null;
  }

  this.bang = function()
  {
    return this.any_neighbor_is("b");
  }

  this.left = function(req = null)
  {
    var g = pico.program.glyph_at(this.x-1,this.y,req);
    return g != "." ? {x:this.x-1,y:this.y,glyph:g} : null;
  }

  this.right = function(req)
  {
    var g = pico.program.glyph_at(this.x+1,this.y,req);
    return g != "." ? {x:this.x+1,y:this.y,glyph:g} : null;
  }

  this.up = function(req)
  {
    var g = pico.program.glyph_at(this.x,this.y-1,req);
    return g != "." ? {x:this.x,y:this.y+1,glyph:g} : null;
  }

  this.down = function(req)
  {
    var g = pico.program.glyph_at(this.x,this.y+1,req);
    return g != "." ? {x:this.x,y:this.y-1,glyph:g} : null;
  }

  this.docs = function()
  {
    return `${this.name}`
  }
}