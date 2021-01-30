# Tutorial

If this is your first time trying out **Orca**, watch this [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE). If you're looking for additional examples, visit [this repository](https://git.sr.ht/~rabbits/orca-examples/tree/master/).

## General

- On **OSX**, setup [IAC virtual MIDI buses](https://help.ableton.com/hc/en-us/articles/209774225-Using-virtual-MIDI-buses).
- On **Windows**, setup [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html).
- On **Linux**, setup [qjacktl](https://qjackctl.sourceforge.io/).

## Pilot

[Pilot](https://github.com/hundredrabbits/Pilot) is a minimalist synth software designed to work via UDP, and to quickly get started with Orca. This **requires no setup**, as long as both applications are open, they should be able to communicate with each other.

- Launch Orca & Pilot.
- In Orca, make sure that UDP is pointing to port `49161`.
- Bang something like `;03Cff` to [play a note](https://github.com/hundredrabbits/pilot#play).
- Bang something like `;revff` to [add reverb](https://github.com/hundredrabbits/pilot#effects).

## Ableton Live

To send [Midi notes](https://github.com/hundredrabbits/Orca#midi) to [Ableton Live](https://www.ableton.com/en/) instruments, bang the Midi operator `:`, like `:03C` to send to _Channel 1, Octave 3, Note C_. Have a look at [midi.orca](hhttps://git.sr.ht/~rabbits/orca-examples/tree/master/basics/_midi.orca) to see it in action.

- Launch Ableton Live.
- Create a new **midi instrument** track.
- Select `IAC Driver(Bus 1)`(OSX), or `LoopMidi`(Windows), in the instrument's inputs dropdown.
- Activate the **In** toggle, on the instrument track.

## SonicPi

To send [OSC messages](https://github.com/hundredrabbits/Orca#osc) to [SonicPi](http://sonic-pi.net), select [port 4560](https://github.com/samaaron/sonic-pi/blob/master/etc/doc/tutorial/12.1-Receiving-OSC.md). SonicPi listens to the address defined in `sync`, to send to the `live_loop`, bang the OSC node `=`, like `=a`. If you need help, visit the [SonicPi x Orca forum](https://in-thread.sonic-pi.net/t/using-orca-to-control-sonic-pi-with-osc/2381/).

```
live_loop :drum do
  use_real_time
  sync "/osc*/a"
  sample :bd_haus, rate: 1
end
```

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

## VCV Rack

- Start VCV Rack
- Add a "VCV MIDI-CV" module to your rack
- Set the first parameter, MIDI Driver, to your local loopback driver
  - Windows: Start loopMIDI, be sure to create at least one device, then select "loopMIDI" as the parameter
  - Linux: Use "ALSA" (the widely supported Linux sound architecture)
- Set the second parameter to the MIDI interface
  - Windows: Use the loopMIDI device you created
  - Linux: Select the default "MIDI Through" device (available by default on most ALSA configurations)
- Start Orca
- Use the Hotkey Ctrl+Period to cycle through MIDI output devices until you see your device in the lower-right corner
- Bang a MIDI command to VCV: `:03c88` to get a note and gate trigger from MIDI-CV

## FAQS

### Why does placement of `V` matter?

Orca operates linearly from the top-left, to the bottom-right, operators are executed in that sequence, and so the variables stored at the top, can be overwritten by the variables declared at the bottom.

### Why is orca not making any sound?

Orca is not a synthetizer, it is meant to control audio & visual software, or hardware. Orca will never include domain specific operators to generate music or to create pictures. It is designed to be as generic as possible.

## Golf

### Modulo

Will output the modulo of `6 % 4`.

```
1X.
6I4
```

### Uppercase

Will output uppercase `C`.

```
cA1.
.dAZ
```

### Lowercase

Will output lowercase `C`.

```
H..
CM1
```

### Not Null

Will bang if `L` free input is not null.

```
.L0.
..F0
```
