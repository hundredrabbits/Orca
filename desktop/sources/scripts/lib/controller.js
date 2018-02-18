function Controller()
{
  this.menu = {default:{}};
  this.mode = "default";

  this.app = require('electron').remote.app;

  this.start = function()
  {
  }

  this.add = function(mode,cat,label,fn,accelerator)
  {
    if(!this.menu[mode]){ this.menu[mode] = {}; }
    if(!this.menu[mode][cat]){ this.menu[mode][cat] = {}; }
    this.menu[mode][cat][label] = {fn:fn,accelerator:accelerator};
    console.log(`${mode}/${cat}/${label} <${accelerator}>`);
  }

  this.add_role = function(mode,cat,label)
  {
    if(!this.menu[mode]){ this.menu[mode] = {}; }
    if(!this.menu[mode][cat]){ this.menu[mode][cat] = {}; }
    this.menu[mode][cat][label] = {role:label};    
  }

  this.set = function(mode = "default")
  {
    this.mode = mode;
    this.commit();
  }

  this.format = function()
  {
    var f = [];
    var m = this.menu[this.mode];
    for(cat in m){
      var submenu = [];
      for(name in m[cat]){
        var option = m[cat][name];
        if(option.role){
          submenu.push({role:option.role})
        }
        else{
          submenu.push({label:name,accelerator:option.accelerator,click:option.fn})  
        }
      }
      f.push({label:cat,submenu:submenu});
    }
    return f;
  }

  this.commit = function()
  {
    this.app.inject_menu(this.format());
  }

  this.docs = function()
  {
    console.log("Generating docs..");
    var svg = this.generate_svg(this.format())
    var txt = this.documentation(this.format());
    dialog.showSaveDialog((fileName) => {
      if (fileName === undefined){ return; }
      fileName = fileName.substr(-4,4) != ".svg" ? fileName+".svg" : fileName;
      fs.writeFile(fileName,svg);
      fs.writeFile(fileName.replace(".svg",".md"),txt);
    }); 
  }

  this.generate_svg = function(m)
  {
    var svg_html = "";

    for(id in this.layout){
      var key = this.layout[id];
      var acc = this.accelerator_for_key(key.name,m);
      svg_html += `<rect x="${key.x + 1}" y="${key.y + 1}" width="${key.width - 2}" height="${key.height - 2}" rx="4" ry="4" title="${key.name}" stroke="#ccc" fill="none" stroke-width="1"/>`;
      svg_html += `<rect x="${key.x + 3}" y="${key.y + 3}" width="${key.width - 6}" height="${key.height - 12}" rx="3" ry="3" title="${key.name}" stroke="${acc.basic ? '#000' : acc.ctrl ? '#ccc' : '#fff'}" fill="${acc.basic ? '#000' : acc.ctrl ? '#ccc' : '#fff'}" stroke-width="1"/>`;
      svg_html += `<text x="${key.x + 10}" y="${key.y + 20}" font-size='11' font-family='Input Mono' stroke-width='0' fill='${acc.basic ? '#fff' : '#000'}'>${key.name.toUpperCase()}</text>`;
      svg_html += acc && acc.basic ? `<text x="${key.x + 10}" y="${key.y + 35}" font-size='7' font-family='Input Mono' stroke-width='0' fill='#fff'>${acc.basic}</text>` : '';
      svg_html += acc && acc.ctrl ? `<text x="${key.x + 10}" y="${key.y + 45}" font-size='7' font-family='Input Mono' stroke-width='0' fill='#000'>${acc.ctrl}</text>` : '';
    }
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="900" height="300" version="1.0" style="fill:none;stroke:black;stroke-width:2px;">${svg_html}</svg>`;
  }

  this.documentation = function()
  {
    var txt = "";

    txt += this.documentation_for_mode("default",this.menu.default);

    for(name in this.menu){
      if(name == "default"){ continue; }
      txt += this.documentation_for_mode(name,this.menu[name]);
    }
    return txt;
  }

  this.documentation_for_mode = function(name,mode)
  {
    var txt = `## ${name} Mode\n\n`;

    for(id in mode){
      if(id == "*" || id == "Edit"){ continue; }
      txt += `### ${id}\n`;
      for(name in mode[id]){
        var option = mode[id][name];
        txt += `- ${name}: \`${option.accelerator}\`\n`;
      }
      txt += "\n"
    }

    return txt+"\n";
  }

  this.accelerator_for_key = function(key,menu)
  {
    var acc = {basic:null,ctrl:null}
    for(cat in menu){
      var options = menu[cat];
      for(id in options.submenu){
        var option = options.submenu[id]; if(option.role){ continue; }
        acc.basic = (option.accelerator.toLowerCase() == key.toLowerCase()) ? option.label.toUpperCase().replace("TOGGLE ","").substr(0,8).trim() : acc.basic;
        acc.ctrl = (option.accelerator.toLowerCase() == ("CmdOrCtrl+"+key).toLowerCase()) ? option.label.toUpperCase().replace("TOGGLE ","").substr(0,8).trim() : acc.ctrl;
      }
    }
    return acc;
  }

  this.layout = [
    {x:0,   y:0,   width:60,  height:60, name:"esc"},
    {x:60,  y:0,   width:60,  height:60, name:"1"},
    {x:120, y:0,   width:60,  height:60, name:"2"},
    {x:180, y:0,   width:60,  height:60, name:"3"},
    {x:240, y:0,   width:60,  height:60, name:"4"},
    {x:300, y:0,   width:60,  height:60, name:"5"},
    {x:360, y:0,   width:60,  height:60, name:"6"},
    {x:420, y:0,   width:60,  height:60, name:"7"},
    {x:480, y:0,   width:60,  height:60, name:"8"},
    {x:540, y:0,   width:60,  height:60, name:"9"},
    {x:600, y:0,   width:60,  height:60, name:"0"},
    {x:660, y:0,   width:60,  height:60, name:"-"},
    {x:720, y:0,   width:60,  height:60, name:"plus"},
    {x:780, y:0,   width:120, height:60, name:"backspace"},
    {x:0,   y:60,  width:90,  height:60, name:"tab"},
    {x:90,  y:60,  width:60,  height:60, name:"q"},
    {x:150, y:60,  width:60,  height:60, name:"w"},
    {x:210, y:60,  width:60,  height:60, name:"e"},
    {x:270, y:60,  width:60,  height:60, name:"r"},
    {x:330, y:60,  width:60,  height:60, name:"t"},
    {x:390, y:60,  width:60,  height:60, name:"y"},
    {x:450, y:60,  width:60,  height:60, name:"u"},
    {x:510, y:60,  width:60,  height:60, name:"i"},
    {x:570, y:60,  width:60,  height:60, name:"o"},
    {x:630, y:60,  width:60,  height:60, name:"p"},
    {x:690, y:60,  width:60,  height:60, name:"["},
    {x:750, y:60,  width:60,  height:60, name:"]"},
    {x:810, y:60,  width:90,  height:60, name:"|"},
    {x:0,   y:120, width:105, height:60, name:"caps"},
    {x:105, y:120, width:60,  height:60, name:"a"},
    {x:165, y:120, width:60,  height:60, name:"s"},
    {x:225, y:120, width:60,  height:60, name:"d"},
    {x:285, y:120, width:60,  height:60, name:"f"},
    {x:345, y:120, width:60,  height:60, name:"g"},
    {x:405, y:120, width:60,  height:60, name:"h"},
    {x:465, y:120, width:60,  height:60, name:"j"},
    {x:525, y:120, width:60,  height:60, name:"k"},
    {x:585, y:120, width:60,  height:60, name:"l"},
    {x:645, y:120, width:60,  height:60, name:";"},
    {x:705, y:120, width:60,  height:60, name:"'"},
    {x:765, y:120, width:135, height:60, name:"enter"},
    {x:0,   y:180, width:135, height:60, name:"shift"},
    {x:135, y:180, width:60,  height:60, name:"z"},
    {x:195, y:180, width:60,  height:60, name:"x"},
    {x:255, y:180, width:60,  height:60, name:"c"},
    {x:315, y:180, width:60,  height:60, name:"v"},
    {x:375, y:180, width:60,  height:60, name:"b"},
    {x:435, y:180, width:60,  height:60, name:"n"},
    {x:495, y:180, width:60,  height:60, name:"m"},
    {x:555, y:180, width:60,  height:60, name:","},
    {x:615, y:180, width:60,  height:60, name:"."},
    {x:675, y:180, width:60,  height:60, name:"/"},
    {x:735, y:180, width:165, height:60, name:"capslock"},
    {x:0,   y:240, width:90,  height:60, name:"ctrl"},
    {x:90,  y:240, width:90,  height:60, name:"cmd"},
    {x:180, y:240, width:90,  height:60, name:"alt"},
    {x:270, y:240, width:270, height:60, name:"space"},
    {x:810, y:240, width:90,  height:60, name:"ctrl"},
    {x:720, y:240, width:90,  height:60, name:"pn"},
    {x:630, y:240, width:90,  height:60, name:"fn"},
    {x:540, y:240, width:90,  height:60, name:"alt"}
  ];
}

module.exports = new Controller();