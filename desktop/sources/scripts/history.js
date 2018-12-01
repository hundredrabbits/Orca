'use strict'

function History(orca, terminal)
{
  this.index = 0
  this.frames = []

  this.record = function()
  {
    this.frames.push(`${orca}`)
    this.index = this.frames.length
    console.log('History',`f${this.frames.length}`)
  }

  this.undo = function()
  {
    if(this.index === 0){ console.warn('History','Reached beginning'); return; }

    this.index = clamp(this.index-1,0,this.frames.lengt-1)
    console.log('History',`${this.index}/${this.frames.length}`)

    terminal.load(this.frames[this.index])
  }

  this.redo = function()
  {
    if(this.index > this.frames.length-1){ console.warn('History','Reached end'); return; }

    this.index = clamp(this.index+1,0,this.frames.lengt-1)
    console.log('History',`${this.index}/${this.frames.length}`)

    terminal.load(this.frames[this.index])
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = History