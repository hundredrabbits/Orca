function program_I(x,y)
{
  Program_Default.call(this,x,y);

  var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

  this.name = "increment"
  this.glyph = "i";

  this.operation = function()
  {
    if(this.left()){
      pico.program.add(this.x-1,this.y,this.inc(this.left()))
    }
    if(this.right()){
      pico.program.add(this.x+1,this.y,this.inc(this.right()))
    }
    if(this.up()){
      pico.program.add(this.x,this.y+1,this.inc(this.right()))
    }
    if(this.down()){
      pico.program.add(this.x,this.y-1,this.inc(this.right()))
    }
  }

  this.inc = function(letter)
  {
    var index = letters.indexOf(letter);

    if(index < 0){ return; }

    return letters[(index+1) % letters.length];
  }
}