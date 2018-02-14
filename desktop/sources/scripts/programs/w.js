function program_W(x,y)
{
  Program_Default.call(this,x,y);

  this.name = "warp"
  this.glyph = "w";

  this.operation = function()
  {
    var warp = this.find_warp();

    if(warp && this.left()){
      pico.program.add(warp.x+2,warp.y,this.left())
      pico.program.remove(this.x-1,this.y)
    }
    if(warp && this.right()){
      pico.program.add(warp.x-2,warp.y,this.right())
      pico.program.remove(this.x+1,this.y)
    }
    if(warp && this.up()){
      pico.program.add(warp.x,warp.y-2,this.up())
      pico.program.remove(this.x,this.y+1)
    }
    if(warp && this.down()){
      pico.program.add(warp.x,warp.y+2,this.down())
      pico.program.remove(this.x,this.y-1)
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