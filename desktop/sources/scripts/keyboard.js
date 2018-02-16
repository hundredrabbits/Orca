function Keyboard()
{
  this.locks = [];
  this.history = "";

  this.listen_onkeydown = function(event)
  {
    if(event.key == "`"){ pico.program.debug(); event.preventDefault(); return;}
    if(event.keyCode == 38){ keyboard.key_arrow_up(); return; }
    if(event.keyCode == 40){ keyboard.key_arrow_down(); return; }
    if(event.keyCode == 37){ keyboard.key_arrow_left(); return; }
    if(event.keyCode == 39){ keyboard.key_arrow_right(); return; }

    if(event.key == "Backspace"){ pico.grid.cursor.insert("."); return; }
    if(event.key == "Space"){ pico.grid.cursor.insert("."); return; }

    if(event.key.length == 1){
      pico.grid.cursor.insert(event.key);
      if(event.shiftKey){
        pico.grid.cursor.move(1,0)
      }
    }
  }

  this.key_arrow_up = function()
  {
    pico.grid.cursor.move(0,1);
  }

  this.key_arrow_down = function()
  {
    pico.grid.cursor.move(0,-1);
  }

  this.key_arrow_left = function()
  {
    pico.grid.cursor.move(-1,0);
  }

  this.key_arrow_right = function()
  {
    pico.grid.cursor.move(1,0);
  }
}
