'use strict'

function QQQ (terminal) {
  this.terminal = terminal
  this.volume = 1
  this.midi = false

  this.start = function () {
    this.midiSetup()
  }

  this.midiSetup = function () {
    if (!navigator.requestMIDIAccess) { return }

    navigator.requestMIDIAccess({ sysex: false }).then(this.midiActive, this.midiInactive)
  }

  this.midiActive = function (midiAccess) {
    var outputs = midiAccess.outputs.values()
    // loop over all available inputs and listen for any MIDI input
    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
      console.log(output)
      // each time there is a midi message call the onMIDIMessage function
      // output.value.onmidimessage = onMIDIMessage;
    }
  }

  this.midiInactive = function (err) {

  }

  this.play = function () {

    // var noteon,
    //     noteoff,
    //     outputs = [];

    // // Grab an array of all available devices
    // var iter = interface.outputs.values();
    // for (var i = iter.next(); i && !i.done; i = iter.next()) {
    //   outputs.push(i.value);
    // }

    // // Craft 'note on' and 'note off' messages (channel 3, note number 60 [C3], max velocity)
    // noteon = [0x92, 60, 127];
    // noteoff = [0x82, 60, 127];

    // // Send the 'note on' and schedule the 'note off' for 1 second later
    // outputs[0].send(noteon);
    // setTimeout(
    //   function() {
    //     outputs[0].send(noteoff);
    //   },
    //   1000
    // );
  }

  this.setVolume = function (value) {
    this.terminal.log(`Changed volume to ${value}.`)
    this.volume = parseInt(value) / 100.0
  }
}

module.exports = QQQ
