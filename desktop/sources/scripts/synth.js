const Tone = require('Tone')

function Synth()
{
  this.synth = null;

  this.table = {
    A: "C3",
    B: "D3",
    C: "E3",
    D: "F3",
    E: "G3",
    F: "A3",
    G: "B3",
    H: "C4",
    I: "D4",
    J: "E4",
    K: "F4",
    L: "G4",
    M: "A4",
    N: "B4",
    O: "C5",
    P: "D5",
    Q: "E5",
    R: "F5",
    S: "G5",
    T: "A5",
    U: "B5",
    V: "C6",
    W: "D6",
    Y: "E6",
    Z: "F6",
    0: "G6",
    1: "C6",
    2: "D6",
    3: "E7",
    4: "F7",
    5: "G7",
    6: "A7",
    7: "B7",
    8: "C7",
    9: "D7",
  }

  this.last = null;
  this.tick = 0

  this.install = function()
  {
    this.synth = new Tone.AMSynth({
      harmonicity  : 2 ,
      detune  : 0 ,
      oscillator  : {
      type  : 'triangle'
      }  ,
        envelope  : {
        attack  : 0.01 ,
        decay  : 0.01 ,
        sustain  : 0.5 ,
        release  : 1.5
      }  ,
      modulation  : {
        type  : 'sine'
      }  ,
      modulationEnvelope  : {
        attack  : 0.25 ,
        decay  : 0 ,
        sustain  : 1 ,
        release  : 1.5
      }
    }).toMaster()
  }

  this.play = function(glyph)
  {
    if(!glyph || glyph == "." || glyph == ""){ return; }

    var note = this.convert(glyph)

    if(this.last == note){ this.last = null; return; }

    this.synth.triggerAttackRelease(note, "4n");

    if(this.tick % 4 == 0){
      this.kick();
    }
    this.last = note;
    this.tick += 1;
    this.clear();
  }

  this.kick = function()
  {
    var synth = new Tone.MembraneSynth().toMaster();
    synth.triggerAttackRelease("C2", "16n");
  }

  this.clear = function()
  {
    pico.program.remove(pico.program.w-1,pico.program.h-1)
  }

  this.convert = function(glyph)
  {
    return this.table[glyph.toUpperCase()];
  }
}