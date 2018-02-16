function program_W(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "warp"
  this.glyph = "w";
  this.ports = [{x:0,y:-1},{x:0,y:1,output:true}];

  this.operation = function()
  {
    var input = this.up();

    if(input){
      var warp = this.find_warp();
      if(warp){
        pico.program.add(warp.x,warp.y+1,input.glyph)
        pico.program.remove(this.x,this.y-1)  
      }
    }
  }

  this.find_warps = function()
  {
    var a = [];
    var y = 0;
    while(y < pico.program.h){
      var x = 0;
      while(x < pico.program.w){
        if(pico.program.glyph_at(x,y) == "w"){ a.push({x:x,y:y})}
        x += 1
      }
      y += 1;
    }
    return a;
  }

  this.find_warp = function()
  {
    var warps = this.find_warps();

    if(warps.length < 2){ return; }

    var warp_id = -1;
    for(id in warps){
      var warp = warps[id];
      if(warp.x == this.x && warp.y == this.y){
        warp_id = id;
      }
    }
    return warps[(warp_id+1) % warps.length]
  }
}