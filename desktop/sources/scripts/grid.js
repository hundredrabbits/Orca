function Grid()
{
  this.el = document.createElement("canvas");

  this.size = {width:600,height:600,ratio:0.75}
  this.el.width = this.size.width;
  this.el.height = this.size.height;
  this.el.style.width = (this.size.width * this.size.ratio)+"px";
  this.el.style.height = (this.size.height * this.size.ratio)+"px";

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
      var key = key.toLowerCase();
      if(pico.program.glyphs.indexOf(key) < 0){ console.log("Illegal rune"); return; }
      pico.program.add(this.x,this.y,key);
    },
    inspect: function(){
      return pico.program.glyph_at(this.x,this.y)
    }
  }

  this.install = function(host)
  {
    host.appendChild(this.el)
  }

  this.update = function()
  {
    this.clear();

    var y = 0;
    while(y < pico.program.h){
      var x = 0;
      while(x < pico.program.w){
        var styles = {
          is_cursor: pico.grid.is_cursor(x,y),
          is_port: pico.grid.is_port(x,y)
        }
        this.draw_sprite(x,y,pico.program.glyph_at(x,y),styles);
        x += 1
      }
      y += 1;
    }
  }

  this.is_cursor = function(x,y)
  {
    return this.cursor.x == x && this.cursor.y == y;
  }

  this.is_port = function(x,y)
  {
    for(id in pico.program.ports){
      var port = pico.program.ports[id];
      if(port.x == x && port.y == y){
        return port;
      }
    }
    return false;
  }

  this.context = function()
  {
    return this.el.getContext('2d');
  }

  this.clear = function()
  {
    var ctx = this.context();

    ctx.clearRect(0, 0, this.size.width, this.size.height);
  }

  this.draw_sprite = function(x,y,g,styles = {is_cursor: false,is_port: false})
  {
    var tile         = {w:15,h:20}
    var ctx          = this.context();

    ctx.textBaseline = 'bottom';
    ctx.textAlign    = "center"; 
    ctx.font         = `${tile.h*0.75}px input_mono_regular`;

    if(styles.is_cursor){
      ctx.fillStyle    = styles.is_cursor ? 'white' : 'black';
      ctx.fillRect((x+0.5)*tile.w,(y)*tile.h,tile.w,tile.h);  
      ctx.fillStyle    = 'black';
    }
    else if(styles.is_port){
      if(styles.is_port.output){
        ctx.fillStyle = '#72dec2'
        ctx.fillRect((x+0.5)*tile.w,(y)*tile.h,tile.w,tile.h);  
        ctx.fillStyle    = 'black';
      }
      else if(styles.is_port.bang){
        ctx.fillStyle = '#ffb545'
        ctx.fillRect((x+0.5)*tile.w,(y)*tile.h,tile.w,tile.h);  
        ctx.fillStyle    = 'black';
      }
      else{
        ctx.fillStyle = '#444'
        ctx.fillRect((x+0.5)*tile.w,(y)*tile.h,tile.w,tile.h);  
        ctx.fillStyle    = 'white';
      }
    }
    else{
      ctx.fillStyle    = 'white';
    }
    
    ctx.fillText(styles.is_cursor && g == "." ? "@" :g.toUpperCase(), (x+1) * tile.w, (y+1) * tile.h);
  }

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
}