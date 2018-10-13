"use strict";

const blessed  = require('blessed');

function Terminal(pico)
{  
  this._screen = blessed.screen();
  this._grid = blessed.box({ top: 1, left: 2, height: '100%-3', width: 39, keys: true, mouse: true, style: { fg: '#efefef' } });
  this._output = blessed.box({ bottom: 0, left: 2, height: 1, width: 1, style: { fg: '#fff' } });

  this.cursor = {
    x: 0,
    y: 0,
    move: function (x, y) {
      this.x += x
      this.y -= y
      this.x = clamp(this.x, 0, pico.program.w - 1)
      this.y = clamp(this.y, 0, pico.program.h - 1)
    },
    insert: function (k) {
      const key = k.trim() == '' ? '.' : k.toLowerCase()
      if (pico.program.glyphs.indexOf(key) < 0) { console.log(`Illegal rune:${key}`); return }
      pico.program.add(this.x, this.y, key)
    },
    inspect: function () {
      return pico.program.glyph_at(this.x, this.y)
    }
  }

  this.install = function()
  {
    this._screen.append(this._grid);
    this._screen.append(this._output);
  }

  this.start = function()
  {
    pico.new()
    this._screen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));    
    this._screen.key(['up'], (ch, key) => { this.cursor.move(0,1); this.update(); }); 
    this._screen.key(['down'], (ch, key) => { this.cursor.move(0,-1); this.update(); }); 
    this._screen.key(['right'], (ch, key) => { this.cursor.move(1,0); this.update(); }); 
    this._screen.key(['left'], (ch, key) => { this.cursor.move(-1,0); this.update(); }); 

    this._screen.on('keypress', (ch)=>{ 
      if(!ch){ return; }
      const str = ch.substr(0,1).replace(/[^0-9a-z]/gi, '') 
      if(str == ""){ return; }
      this.cursor.insert(str)
    });

    this.update()
  }

  this.add_cursor = function(s)
  {
    const index = pico.program.index_at(this.cursor.x, this.cursor.y)
    return s.substr(0, index) + "@" + s.substr(index + 1)
  }

  this.update = function(sight)
  {
    const s = pico.program.s

    this._grid.setContent(`${this.add_cursor(s)}`)
    this._screen.render();
  }

  // Events

  this.on_submit = function(text)
  {
    this.query(text);
    this._icon.setContent(":");
    this._input.clearValue();
    this._input.focus();
    this._screen.render();
  }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Terminal
