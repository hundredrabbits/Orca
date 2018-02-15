function program_I(x,y)
{
  Program_Default.call(this,x,y);

  var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9","0"];

  this.name = "increment"
  this.glyph = "i";

  this.operation = function()
  {
    var n = this.neighbor();
    pico.program.add(n.x,n.y,this.inc(n.glyph));
  }

  this.inc = function(letter)
  {
    var index = letters.indexOf(letter);

    if(index < 0){ return; }

    return letters[(index+1) % letters.length];
  }
}