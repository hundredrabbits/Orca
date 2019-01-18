# Tutorial

If you don't understand what ORCA is, here's an [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE). If you are on a Windows machine, use [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html) to help routing midi signal across applications.

## SonicPi

Using Orca with [SonicPi](http://sonic-pi.net) is quite simple, all it really needs is to send OSC via port `4559`. Learn how to [select the Orca OSC Port](https://github.com/hundredrabbits/Orca#osc). SonicPi listened to channels defined in `sync`, to send to this live loop, use the OSC node `=`, like `=a`.

```
live_loop :drum do
  use_real_time
  sync "/osc/a"
  sample :bd_haus, rate: 1
end
```

## Ableton Live

To control instruments in [Ableton Live](https://www.ableton.com/en/), launch [Orca](README.md) and open [examples/midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca).

- Launch Ableton Live.
- Create a new midi instrument track.
- Select `IAC Driver(Bus 1)`(OSX), or `LoopMidi`(Windows), in the instrument's inputs dropdown. 
- Activate the **In** toggle. 

The midi instrument should begin receiving midi notes as soon as the Orca window is **back into focus**.

# Patterns

Here's a collection of recurring patterns in the design of Orca machines.

## J Funnel

```
.1Y12.
...JJ.
..A12.
..3...
```

## X Stack

```
.21X1..
.10X2..
...A21.
...3...
```
