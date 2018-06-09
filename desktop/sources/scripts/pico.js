function Pico()
{
  this.el = document.createElement("app");

  this.controller = new Controller();
  this.program = new Program(39,29);
  this.grid = new Grid();

  this.install = function()
  {
    this.grid.install(this.el);
    this.program.reset();
    document.body.appendChild(this.el)

    this.controller.add("default","*","About",() => { require('electron').shell.openExternal('https://github.com/hundredrabbits/Donsol'); },"CmdOrCtrl+,");
    this.controller.add("default","*","Fullscreen",() => { app.toggle_fullscreen(); },"CmdOrCtrl+Enter");
    this.controller.add("default","*","Hide",() => { app.toggle_visible(); },"CmdOrCtrl+H");
    this.controller.add("default","*","Inspect",() => { app.inspect(); },"CmdOrCtrl+.");
    this.controller.add("default","*","Documentation",() => { pico.controller.docs(); },"CmdOrCtrl+Esc");
    this.controller.add("default","*","Reset",() => { pico.reset(); },"CmdOrCtrl+Backspace");
    this.controller.add("default","*","Quit",() => { app.exit(); },"CmdOrCtrl+Q");

    this.controller.add("default","File","New",() => { pico.reset(); },"CmdOrCtrl+N");
    this.controller.add("default","File","Save",() => { pico.save(); },"CmdOrCtrl+S");
    this.controller.add("default","File","Open",() => { pico.load(); },"CmdOrCtrl+O");

    this.controller.add("default","Program","Play/Pause",() => { pico.pause(); },"CmdOrCtrl+P");

    this.controller.commit();
  }

  this.start = function()
  {
    setInterval(() => { this.run(); }, 200)
  }

  this.reset = function()
  {
    this.program.reset();
    this.grid.update();
  }

  this.save = function()
  {
    dialog.showSaveDialog((fileName) => {
      if (fileName === undefined){ return; }
      fileName = fileName.substr(-4,4) != ".pico" ? fileName+".pico" : fileName;
      fs.writeFile(fileName,pico.program.output());
    }); 
  }

  this.load = function()
  {
    var filepath = dialog.showOpenDialog({filters: [{name: 'Pico Files', extensions: ['pico']}], properties: ['openFile']});
    if(!filepath){ console.log("Nothing to load"); return; }
    fs.readFile(filepath[0], 'utf-8', (err, data) => {
      if(err){ alert("An error ocurred reading the file :" + err.message); return; }
      pico.program.s = data.replace(/\n/g,'').replace(/[^0-9a-z]/gi,".");
    });
  }

  this.f = 0;
  this.is_paused = false

  this.run = function()
  {
    if(this.is_paused){ return; }

    this.program.run();
    this.grid.update();
    this.f += 1;
  }

  this.pause = function()
  {
    this.is_paused = this.is_paused ? false : true
  }
}