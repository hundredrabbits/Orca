# Tutorial

If this is your first time trying out **Orca**, watch this [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE). 

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

## Bitwig

The following is taken from this page: https://answers.bitwig.com/questions/1218/how-do-i-get-midi-inout-of-bws-on-linux

- Quit Bitwig if running.
- Start `qjacktl`.
- Go to _Setup > Settings > Parameters_ and set MIDI Driver to "none" (this turns off jack-midi)
- Go to Setup > Misc and check "Enable ALSA Sequencer Support" (if not enabled)
- Stop Jack if running and quit gjackctl
- Run sudo modprobe snd_virmidi midi_devs=1 (to enable virtual midi with one device which is easier to understand for now)
- Start qjacktl
- Start jack
- Open Connections: Connect device on left "0: QuNexus MIDI 1" to "0:VirMIDI 5-0"
- Open Bitwig
- Under Options > Preferences > Controllers click "Add controller manually"
- Choose "Generic MIDI Keyboard"
- Once it appears as an input choose "Virtual Raw MIDI/1"

## SonicPi

To send [OSC messages](https://github.com/hundredrabbits/Orca#osc) to [SonicPi](http://sonic-pi.net), select [port 4559](https://github.com/hundredrabbits/Orca#osc). SonicPi listens to the address defined in `sync`, to send to the `live_loop`, bang the OSC node `=`, like `=a`. Have a look at [sonicpi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/projects/sonicpi.orca) to see it in action.

```
live_loop :drum do
  use_real_time
  sync "/osc/a"
  sample :bd_haus, rate: 1
end
```

## Dotgrid

To send [UDP messages](https://github.com/hundredrabbits/Orca#udp) to [Dotgrid](http://github.com/hundredrabbits/Dotgrid), select [port 49160](https://github.com/hundredrabbits/Orca#udp). To draw lines on Dotgrid, you need to bang the UDP node `;` with different [commands](https://github.com/hundredrabbits/Dotgrid/blob/master/desktop/sources/scripts/listener.js). Have a look at [dotgrid.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/projects/dotgrid.orca) to see it in action.

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

[Pilot](https://github.com/hundredrabbits/Pilot) is a minimalist synth software designed to work via UDP, and to quickly get started with Orca. Remember that **Pilot uses UDP instead of MIDI**. Have a look at [pilot.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/projects/pilot.orca) to see how it should be used.

## Patterns

Here's a collection of recurring patterns in the design of Orca machines.

### J Funnel

Move two horizontal values next to each other.

```
.1Y12.
...JJ.
..A12.
..3...
```

### X Stack

Move two vertical values next to each other.

```
.21X1..
.10X2..
...A21.
...3...
```

### Y Projector

A very simple projector using a yumper.

```
..D4..
.H*...
.Ey.E.
......
```

### U Loop

A rotating effector.

```
...U..
.U....
....U.
..U...
```

### Capacitor

Banging the lowercase `i` charges it, discharges a bang each n-1 times, n is 9 in the example.

```
3O.....
..Y.i09
..F01..
.......
```

### One Shot Counter

Banging the lowercase `x` triggers it, count ranges from the right `x` input to the last right `F` input.

```
24x0...
14O....
.F88...
.*Y*h..
....I0z
```

## Families

| Families                                               | Glyphs
| ----------                                             | -----------
| Directions                                             | N S E W Z
| [Math](https://www.youtube.com/watch?v=CR1TMGYhCoE)    | A F I M R
| Writers                                                | G P X
| Readers                                                | Q T O
| [Jumpers](https://www.youtube.com/watch?v=CR1TMGYhCoE) | J Y
| Timers                                                 | C D
| Variables                                              | K V
| Misc                                                   | B H L U
| Special                                                | * # ; : =
