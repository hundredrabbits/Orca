# Tutorial

If you don't understand what ORCA is, here's an [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE). If you are on a Windows machine, use [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html) to help routing midi signal across applications.

## SonicPi

Using Orca with [SonicPi](http://sonic-pi.net) is quite simple, all it really needs is to send OSC via port `4559`. Learn how to [select the OSC Port](https://github.com/hundredrabbits/Orca#osc). SonicPi listens to the address defined in `sync`, to send to the `live_loop`, bang the OSC node `=`, like `=a`.

```
live_loop :drum do
  use_real_time
  sync "/osc/a"
  sample :bd_haus, rate: 1
end
```

## Ableton Live

To send [Midi notes](https://github.com/hundredrabbits/Orca#midi) to [Ableton Live](https://www.ableton.com/en/) instruments, bang the midi node `:`, like `:03C` to send to _Channel 1, Octave 3, Note C_.

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
