"use strict";

function program_E(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "explode"
  this.glyph = "e";

  this.ports = [{x:0,y:0,bang:true}];

  this.operation = function()
  {
    let b = this.bang();

    if(!b){ return; }

    this.remove();
    pico.program.lock(b.x,b.y);
    
    let ns = this.free_neighbors();
    for(let id in ns){
      let n = ns[id];
      pico.program.add(n.x,n.y,"b");
    }
  }
}