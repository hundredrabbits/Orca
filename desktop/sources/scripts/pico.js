"use strict";

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
    dialog.showSaveDialog({title:"Save to .pico",filters: [{name: "Pico Format", extensions: ["pico"]}]},(fileName) => {
      if(fileName === undefined){ return; }
      fileName = fileName.substr(-5,5) != ".pico" ? fileName+".pico" : fileName;
      fs.writeFileSync(fileName, content);
    }); 
  }

  this.open = function()
  {
    let filepath = dialog.showOpenDialog({filters: [{name: 'Pico Files', extensions: ['pico']}], properties: ['openFile']});
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