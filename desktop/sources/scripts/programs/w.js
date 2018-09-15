"use strict";

function program_W(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "warp"
  this.glyph = "w";
  this.ports = [{x:0,y:-1},{x:0,y:1,output:true},{x:0,y:0,bang:true}];

  this.operation = function()
  {
    let input = this.up();
    let active = this.bang() || this.neighbors("1").length > 0

    if(input && active){
      let warp = this.find_warp(this);
      if(!warp){ return; }
      pico.program.add(warp.x,warp.y+1,input.glyph)
      pico.program.remove(this.x,this.y-1);
      pico.program.lock(warp.x,warp.y+1);
    }
    
  }

  this.find_warps = function(origin)
  {
    let a = [];
    let y = 0;
    while(y < pico.program.h){
      let x = 0;
      while(x < pico.program.w){
        if(pico.program.glyph_at(x,y) == "w"){
          a.push({x:x,y:y})  
        }
        x += 1
      }
      y += 1;
    }
    return a;
  }

  this.find_warp = function(origin)
  {
    let warps = this.find_warps(origin);

    if(warps.length < 2){ return; }

    let warp_id = -1;
    for(let id in warps){
      let warp = warps[id];
      if(warp.x == this.x && warp.y == this.y){
        warp_id = id;
      }
    }
    return warps[(warp_id+1) % warps.length]
  }
}
