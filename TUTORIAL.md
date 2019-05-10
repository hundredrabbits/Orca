# Tutorial

If this is your first time trying out **Orca**, watch this [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE). If you want to learn how to use a handful of basic operators, have a look at the [workshop](WORKSHOP.md).

## General

- On **OSX**, setup [IAC virtual MIDI buses](https://help.ableton.com/hc/en-us/articles/209774225-Using-virtual-MIDI-buses).
- On **Windows**, setup [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html).
- On **Linux**, setup [qjacktl](https://qjackctl.sourceforge.io/).

## Ableton Live

To send [Midi notes](https://github.com/hundredrabbits/Orca#midi) to [Ableton Live](https://www.ableton.com/en/) instruments, bang the Midi operator `:`, like `:03C` to send to _Channel 1, Octave 3, Note C_. Have a look at [midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca) to see it in action.

- Launch Ableton Live.
- Create a new **midi instrument** track.
- Select `IAC Driver(Bus 1)`(OSX), or `LoopMidi`(Windows), in the instrument's inputs dropdown.
- Activate the **In** toggle, on the instrument track.

## Bitwig [Linux and JACK]

The following is taken from this page: https://answers.bitwig.com/questions/1218/how-do-i-get-midi-inout-of-bws-on-linux

- Quit Bitwig if running.
- Start `qjacktl`.
- Go to _Setup > Settings > Parameters_ and set MIDI Driver to "none" (this turns off jack-midi)
- Go to Setup > Misc and check "Enable ALSA Sequencer Support" (if not enabled)
- Stop Jack if running and quit gjackctl
- Run sudo modprobe snd_virmidi midi_devs=1 (to enable virtual midi with one device which is easier to understand for now)
- Start qjacktl
- Start jack
- Open Connections: Connect device on left "0: QuNexus MIDI 1" (as an example) to "0:VirMIDI 5-0"
- Open Bitwig
- Under Options > Preferences > Controllers click "Add controller manually"
- Choose "Generic MIDI Keyboard"
- Once it appears as an input choose "Virtual Raw MIDI/1"

## SonicPi

To send [OSC messages](https://github.com/hundredrabbits/Orca#osc) to [SonicPi](http://sonic-pi.net), select [port 4559](https://github.com/hundredrabbits/Orca#osc). SonicPi listens to the address defined in `sync`, to send to the `live_loop`, bang the OSC node `=`, like `=a`. Have a look at [sonicpi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/software/sonicpi.orca) to see it in action.

```
live_loop :drum do
  use_real_time
  sync "/osc/a"
  sample :bd_haus, rate: 1
end
```

## Dotgrid

To send [UDP messages](https://github.com/hundredrabbits/Orca#udp) to [Dotgrid](http://github.com/hundredrabbits/Dotgrid), select [port 49160](https://github.com/hundredrabbits/Orca#udp). To draw lines on Dotgrid, you need to bang the UDP node `;` with different [commands](https://github.com/hundredrabbits/Dotgrid/blob/master/desktop/sources/scripts/listener.js). Have a look at [dotgrid.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/software/dotgrid.orca) to see it in action.

- `;0`, clear layer **#1**.
- `;0l1234`, add a line from `1,2` to `3,4`.
- `;`, redraw.

Here's a list of supported operations.

```
;0         // Clear Layer 1
;0l1234    // Add Line from 1,2 to 3,4
;0c1234    // Add Clockwise Arc from 1,2 to 3,4
;0r1234    // Add Reverse Arc from 1,2 to 3,4
;          // Redraw
```

## Pilot

[Pilot](https://github.com/hundredrabbits/Pilot) is a minimalist synth software designed to work via UDP, and to quickly get started with Orca. Remember that **Pilot uses UDP instead of MIDI**. Have a look at [pilot.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/software/pilot.orca) to see how it should be used.

## Patterns

### Modulo

```
1X.
6I4
```

### Hold Bang

```
..S
...
Hh.
SF.
```

### Delay

```
3O..
....
.3O.
....
...D
```

### WN Corner

```
H....
Ny..W
```

### ES Corner

```
....H
E..xS
```
