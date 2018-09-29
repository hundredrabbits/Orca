"use strict";

function Pico()
{
  this.el = document.createElement("app");

  this.theme = new Theme({
    background: "#111111",
    f_high: "#ffffff",
    f_med: "#333333",
    f_low: "#000000",
    f_inv: "#000000",
    b_high: "#ffb545",
    b_med: "#72dec2",
    b_low: "#444444",
    b_inv: "#ffffff"
  });
  
  this.controller = null;
  this.program = new Program(39,29);
  this.grid = new Grid();

  this.f = 0;
  this.is_paused = false

  this.install = function(host = document.body)
  {
    this.theme.install(host);
    this.grid.install(this.el);
    host.appendChild(this.el);
    this.program.reset();
  }

  this.start = function()
  {
    this.theme.start();
    setInterval(() => { this.run(); }, 200)
  }

  this.new = function()
  {
    this.program.reset();
    this.grid.update();

  }

  this.reset = function()
  {
    this.theme.reset();
    this.new()
  }

  this.save = function()
  {
    dialog.showSaveDialog({title:"Save to .pico",filters: [{name: "Pico Format", extensions: ["pico"]}]},(fileName) => {
      if(fileName === undefined){ return; }
      fileName = fileName.substr(-5,5) != ".pico" ? fileName+".pico" : fileName;
      fs.writeFileSync(fileName, pico.program.output());
    }); 
  }

  this.open = function()
  {
    const filepath = dialog.showOpenDialog({filters: [{name: 'Pico Files', extensions: ['pico']}], properties: ['openFile']});
    if(!filepath){ console.log("Nothing to load"); return; }
    fs.readFile(filepath[0], 'utf-8', (err, data) => {
      if(err){ alert("An error ocurred reading the file :" + err.message); return; }
      pico.load(data)
    });
  }

  this.load = function(txt)
  {
    pico.program.reset();
    pico.program.s = txt.replace(/\n/g,'').replace(/[^0-9a-z]/gi,".");
    pico.grid.update();
  }

  this.run = function(force = false)
  {
    if(this.is_paused && !force){ return; }

    this.program.run();
    this.grid.update();
    this.f += 1;
  }

  this.pause = function()
  {
    this.is_paused = this.is_paused ? false : true;
    this.grid.update();    
  }
}