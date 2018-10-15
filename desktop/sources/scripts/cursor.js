'use strict'

function Cursor()
{
  this.x = 0
  this.y = 0
  this.w =1
  this.h =1

  this.move = function (x, y) {
    this.x = clamp(this.x + x, 0, pico.w - 1)
    this.y = clamp(this.y - y, 0, pico.h - 1)
    terminal.update()
  }

  this.scale = function(x, y){
    this.w = clamp(this.w + x, 1, 10)
    this.h = clamp(this.h - y, 1, 10)
    terminal.update()
  }

  this.reset = function(){
    this.w = 1
    this.h = 1
  }

  this.copy = function(){
    console.log('copy',this.x,this.y,this.w,this.h)
  }

  this.insert = function (g) {
    pico.add(this.x, this.y, g)
  }

  this.erase = function (g) {
    pico.remove(this.x, this.y)
  }

  this.inspect = function () {
    const g = pico.glyphAt(this.x, this.y)
    return pico.docs[g] ? pico.docs[g] : `${this.x},${this.y}[${this.w}x${this.h}]`
  }
  
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Cursor