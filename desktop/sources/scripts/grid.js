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
      pico.program.add(this.x,this.y,key)
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
        this.draw_sprite(x,y,pico.program.glyph_at(x,y),this.cursor.x == x && this.cursor.y == y);
        x += 1
      }
      y += 1;
    }
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

  this.draw_sprite = function(x,y,g,is_cursor = false)
  {
    var font_size    = 20;
    var ctx          = this.context();
    ctx.font         = `${font_size}px input_mono_regular`;
    ctx.fillStyle    = is_cursor ? 'red' : 'white';
    ctx.textBaseline = 'top';
    ctx.textAlign    = "left"; 
    ctx.fillText(is_cursor && g == "." ? "@" :g.toUpperCase(), x * 20, y * 20);
  }

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
}