function Pico()
{
  this.el = document.createElement("app");

  this.program = new Program(48,32);
  this.grid = new Grid();

  this.install = function()
  {
    this.grid.install(this.el);
    this.program.reset();
    document.body.appendChild(this.el)
  }

  this.start = function()
  {
    this.program.add(4,2,"i");
    this.program.add(3,3,"m");
    this.program.add(2,3,"5");
    this.program.add(4,3,"1");
    this.program.add(3,5,"t");
    this.program.add(4,6,"g");
    this.program.add(3,8,"s");
    this.program.add(4,9,"s");
    this.program.add(6,9,"o");
    this.program.add(4,11,"g");
    this.program.add(6,11,"c");
    this.program.add(1,13,"h");
    this.program.add(2,13,"d");
    this.program.add(3,13,"f");

    setInterval(() => { this.run(); }, 200)
  }

  this.f = 0;

  this.run = function()
  {
    this.program.run();
    this.grid.update();
    this.f += 1;
  }
}