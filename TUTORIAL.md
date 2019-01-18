# Tutorial

If this is your first time hearing about Orca, watch this [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE). If you are on Windows, use something like [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html) to help routing midi signal across applications.

## SonicPi

To send [OSC messages](https://github.com/hundredrabbits/Orca#osc) to [SonicPi](http://sonic-pi.net), select [port 4559](https://github.com/hundredrabbits/Orca#osc). SonicPi listens to the address defined in `sync`, to send to the `live_loop`, bang the OSC node `=`, like `=a`.

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
- `;*`, draw.

Here's a list of supported operations.

```
;0         // Clear Layer 1
;0l1234    // Draw Line from 1,2 to 3,4
;0c1234    // Draw Clockwise Arc from 1,2 to 3,4
;0r1234    // Draw Reverse Arc from 1,2 to 3,4
;*      // Draw
```

## Ableton Live

To send [Midi notes](https://github.com/hundredrabbits/Orca#midi) to [Ableton Live](https://www.ableton.com/en/) instruments, bang the Midi node `:`, like `:03C` to send to _Channel 1, Octave 3, Note C_.

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
