function Grid()
{
  this.el = document.createElement("canvas");

  this.size = {width:600,height:600,ratio:1}
  this.el.width = this.size.width;
  this.el.height = this.size.height;

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
        this.draw_sprite(x,y,pico.program.glyph_at(x,y));
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

    ctx.clearRect(0, 0, this.size.width * this.size.ratio, this.size.height * this.size.ratio);
  }

  this.draw_sprite = function(x,y,g)
  {
    var font_size    = 10;
    var ctx          = this.context();
    ctx.font         = `${font_size}px`;
    ctx.fillStyle    = 'white';
    ctx.textBaseline = 'top';
    ctx.textAlign    = "left"; 
    ctx.fillText(g, x * 10, y * 10);
  }


  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
}