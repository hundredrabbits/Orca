# Tutorial

If this is your first time hearing about Orca, watch this [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE). If you are on Windows, use something like [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html) to help routing midi signal across applications.

| Families                                               | Glyphs     
| ----------                                             | ----------- 
| Directions                                             | N S E W Z
| [Math](https://www.youtube.com/watch?v=CR1TMGYhCoE)    | A F I M R
| Writers                                                | G P X 
| Readers                                                | O Q T
| [Jumpers](https://www.youtube.com/watch?v=CR1TMGYhCoE) | J Y
| Timers                                                 | C D
| Variables                                              | K V
| Misc                                                   | B H L U
| Special                                                | * # ; : =

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

## Ableton Live

To send [Midi notes](https://github.com/hundredrabbits/Orca#midi) to [Ableton Live](https://www.ableton.com/en/) instruments, bang the Midi node `:`, like `:03C` to send to _Channel 1, Octave 3, Note C_. Have a look at [midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca) to see it in action.

- Launch Ableton Live.
- Create a new midi instrument track.
- Select `IAC Driver(Bus 1)`(OSX), or `LoopMidi`(Windows), in the instrument's inputs dropdown. 
- Activate the **In** toggle. 

The midi instrument should begin receiving midi notes as soon as the Orca window is **in focus**.

# Patterns

Here's a collection of recurring patterns in the design of Orca machines.

## J Funnel

Move two horizontal values next to each other.

```
.1Y12.
...JJ.
..A12.
..3...
```

## X Stack

Move two vertical values next to each other.

```
.21X1..
.10X2..
...A21.
...3...
```

## Y Projector

A very simple projector using a yumper.

```
..D4..
.H*...
.Ey.E.
......
```

## U Loop

A rotating effector.

```
...U..
.U....
....U.
..U...
```

## Capacitor

Banging the lowercase `i` charges it, discharges a bang each n-1 times, n is 9 in the example.

```
3O.....
..Y.i09
..F01..
.......
```

## One Shot Counter

Banging the lowercase `x` triggers it, count ranges from the right `x` input to the last right `F` input.

```
24x0...
14O....
.F88...
.*Y*h..
....I0z
```
