function Grid()
{
  this.el = document.createElement("grid");

  this.install = function(host)
  {
    host.appendChild(this.el)
  }

  this.update = function()
  {
    console.log(pico.program.cells)
    var html = "";

    var y = 0;
    while(y < pico.program.h){
      var x = 0;
      while(x < pico.program.w){
        html += pico.program.glyph_at(x,y);
        x += 1
      }
      html += "\n"
      y += 1;
    }

    this.el.innerHTML = html;
  }
}