function program_W(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "warp"
  this.glyph = "w";

  this.operation = function()
  {
    var warp = this.find_warp();
    var n = this.neighbor();

    if(warp && n){
      pico.program.add(warp.x,warp.y-1,n.glyph)
      pico.program.remove(n.x,n.y)
    }
  }

  this.find_warp = function()
  {
    var x = 0;
    while(x < pico.program.w-1){
      if(x != this.x && pico.program.glyph_at(x,this.y) == "w"){
        return {x:x,y:this.y}
      }
      x += 1;
    }

    var y = 0;
    while(y < pico.program.w-1){
      if(y != this.y && pico.program.glyph_at(this.x,y) == "w"){
        return {x:this.x,y:y}
      }
      y += 1;
    }
    return null
  }
}