# Tutorial

If you don't understand what ORCA is, here's an [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE).

## SonicPi

Using Orca with [SonicPi](http://sonic-pi.net) is quite simple, all it really needs is to receive OSC via port `4559`. Learn how to [select the Orca OSC Port](https://github.com/hundredrabbits/Orca#osc). SonicPi listened to channels defined in `sync`, to send to this live loop, use the OSC node `=`, like `d0=/trigger/kick`.

```
live_loop :drum do
  use_real_time
  sync "/osc/trigger/kick"
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

### LoopMidi

On Windows, use [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html) to help routing midi signal across applications.

## Ubuntu

This a guide to help you produce your first sounds with ORCΛ, tested on `Ubuntu 18.04`.

If you don't have `node` installed yet, install it with:

```
sudo apt-get install nodejs
```

### Install TiMidity++

First you will need a software synthesizer. We choose [TiMidity++](http://timidity.sourceforge.net) here. To install the synthesizer on Ubuntu we mainly followed the steps from this [Ubuntu guide on software synthesis](https://help.ubuntu.com/community/Midi/SoftwareSynthesisHowTo),
which are reproduced here:

If you don't have the universe repository activated yet run:

```
sudo add-apt-repository universe
sudo apt-get update
```

Install TiMidity++ and the `freepats` samples:

```
sudo apt-get install timidity freepats
```

You might need to activate the following kernel modules:

```
sudo modprobe snd-seq-device
sudo modprobe snd-seq-midi
sudo modprobe snd-seq-oss
sudo modprobe snd-seq-midi-event
sudo modprobe snd-seq
```

## Make Some Noise!

### Run TiMidity++ as a ALSA sequencer client

Open a terminal were you run the command

```
timidity -iA
```
and keep that terminal open!

This should return an output similar to:
```
Requested buffer size 32768, fragment size 8192
ALSA pcm 'default' set buffer size 32768, period size 8192 bytes
TiMidity starting in ALSA server mode
Opening sequencer port: 130:0 130:1 130:2 130:3
Requested buffer size 32768, fragment size 8192
ALSA pcm 'default' set buffer size 32768, period size 8192 bytes
```
We can see, that the program opens some ports.
In the next step will choose one of those to have ORCΛ send its MIDI output to.
