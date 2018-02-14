function Grid()
{
  this.el = document.createElement("grid");

  this.cursor = {
    x:0,
    y:0,
    move: function(x,y){
      this.x += x;
      this.y -= y;
      this.x = clamp(this.x,0,pico.program.w-1);
      this.y = clamp(this.y,0,pico.program.h-1);
      pico.grid.update();
    },
    insert: function(key){
      pico.program.add(this.x,this.y,key)
    }
  }

  this.install = function(host)
  {
    host.appendChild(this.el)
  }

  this.update = function()
  {
    var html = "";
    var y = 0;
    while(y < pico.program.h){
      var x = 0;
      while(x < pico.program.w){
        if(this.cursor.x == x && this.cursor.y == y){
          html += `<c>${pico.program.glyph_at(x,y)}</c>`;
        }
        else if(pico.program.is_locked(x,y)){
          html += `<l>${pico.program.glyph_at(x,y)}</l>`; 
        }
        else{
          html += pico.program.glyph_at(x,y);  
        }
        x += 1
      }
      html += "\n"
      y += 1;
    }
    this.el.innerHTML = html;
  }

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
}