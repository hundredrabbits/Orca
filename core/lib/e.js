'use strict'

const FnMove = require('./_move')

function FnE (pico, x, y) {
  FnMove.call(this, pico, x, y)

  this.name = 'east'
  this.glyph = 'e'
  this.info = 'Moves eastward, or bangs.'

  this.operation = function () {
    const wire = this.signal()
    if(wire){ return; }

    if (this.is_free(1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(1, 0)
  }

  this.signal = function()
  {
    const e = this.east()
    const w = this.west()
    const n = this.north()
    const s = this.south()

    // Along the wire
    if(e && e.glyph == "-" && w && w.glyph == "-"){
      pico.add(this.x,this.y,'-')
      pico.add(this.x+1,this.y,'e')
      pico.lock(this.x+1,this.y)
      return true
    }
    if(n && n.glyph == "|" && s && s.glyph == "|"){
      pico.add(this.x,this.y,'|')
      pico.add(this.x,this.y-1,'n')
      return true
    }
    return false
  }
}

module.exports = FnE
