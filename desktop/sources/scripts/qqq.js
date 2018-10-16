'use strict'

function QQQ (terminal) {
  this.terminal = terminal
  this.volume = 1
  this.midi = false
  this.outputs = []

  this.start = function () {
    this.midiSetup()
  }

  this.midiSetup = function () {
    if (!navigator.requestMIDIAccess) { return }

    navigator.requestMIDIAccess({ sysex: false }).then(this.midiActive, this.midiInactive)
  }

  this.midiActive = function (midiAccess) {

    const iter = midiAccess.outputs.values();
    for (let i = iter.next(); i && !i.done; i = iter.next()) {
      console.log(terminal.qqq)
      terminal.qqq.outputs.push(i.value);
    }
  }

  this.midiInactive = function (err) {
    console.warn("No Midi")
  }

  this.play = function () {
    let noteon, noteoff;
    noteon = [0x92, 60, 127];
    noteoff = [0x82, 60, 127];

    terminal.qqq.outputs[0].send(noteon);
    setTimeout(
      function() {
        // terminal.qqq.outputs[0].send(noteoff);
      },
      500
    );
  }

  this.setVolume = function (value) {
    this.terminal.log(`Changed volume to ${value}.`)
    this.volume = parseInt(value) / 100.0
  }
}

module.exports = QQQ
