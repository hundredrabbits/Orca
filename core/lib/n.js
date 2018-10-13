'use strict'

const FnMove = require('./_move')

function FnN (pico, x, y) {
  FnMove.call(this, pico, x, y)

  this.name = 'north'
  this.glyph = 'n'
  this.info = 'Moves Northward, or bangs.'

  this.operation = function () {
    const wire = this.signal()
    if(wire){ return; }

    if (this.is_free(0, -1) != true) { this.replace('b'); this.lock(); return }
    this.move(0, -1)
  }

  this.signal = function()
  {
    const e = this.east()
    const w = this.west()
    const n = this.north()
    const s = this.south()

    // Along the wire
    if(n && n.glyph == "|" && s && s.glyph == "|"){
      pico.add(this.x,this.y,'|')
      pico.add(this.x,this.y-1,'n')
      pico.lock(this.x,this.y-1)
      return true
    }

    return false
  }
}

module.exports = FnN
