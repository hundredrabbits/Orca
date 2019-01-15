# Guide

Orca is **not a synth**, but a [livecoding environment](https://www.reddit.com/r/livecoding/) to write procedural sequencers. In other words, **Orca is meant to control other applications** such as a DAW(Ableton, Renoise, VCV Rack, etc.), or an audio server such as SuperCollider.

## OSX

### Ableton Live

To control instruments in [Ableton Live](https://www.ableton.com/en/), launch [Orca](README.md) and open [examples/midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca).

- Launch Ableton Live.
- Create a new midi instrument track.
- Select `IAC Driver(Bus 1)` in the instrument's inputs dropdown. 
- Activate the **In** toggle. 

The midi instrument should begin receiving midi notes as soon as the Orca window is **back into focus**.

### VCV Rack

[TODO]

### SuperCollider

[TODO]

## Windows

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

### Run ORCΛ and set the MIDI device
Open another terminal and navigate to the `desktop` subdirectory of your `Orca` folder and type
```
npm start
```

Next we need to choose our MIDI devices as described in the FAQ's by pressing `ctrl+.`
in ORCΛ to open a browser console (you might need to choose the correct `console` tab at the top).
Type `terminal.io.listMidiDevices()` in the console to obtain an output similar to (expand the output in your console if needed):
```
terminal.io.listMidiDevices()
(5) [MIDIOutput, MIDIOutput, MIDIOutput, MIDIOutput, MIDIOutput]
0: MIDIOutput {connection: "closed", id: "6FF5590044F4859ED50C5167BCFE9700A1798E39AA55A628E86D39011FAECD5D", manufacturer: "", name: "Midi Through Port-0", state: "connected", …}
1: MIDIOutput {connection: "closed", id: "574FB441DEDADDE2DB06598767A3088744994E3AEA26BA638F8C51D004D8D333", manufacturer: "", name: "TiMidity port 0", state: "connected", …}
2: MIDIOutput {connection: "closed", id: "8C1A6E287845194CE38B5B5181F731AE63D54D00681076DF9905B3658DF86248", manufacturer: "", name: "TiMidity port 1", state: "connected", …}
3: MIDIOutput {connection: "closed", id: "A32276E0B2B7CB991939F210D7542BA7A43CE9E97E78C9F5B8D85BA2AC033C5F", manufacturer: "", name: "TiMidity port 2", state: "connected", …}
4: MIDIOutput {connection: "closed", id: "CBE9CBC37EE04BD5C4039207BE53A9C0E36ED85542FEF3FCF6AF4D0901370F08", manufacturer: "", name: "TiMidity port 3", state: "connected", …}
length: 5
__proto__: Array(0)
```

So we see that the TiMidity++ ports are devices 1 to 4.
Set the MIDI Device e.g. to the first of those by typing `terminal.io.setMidiDevice(1)` in the console.
This should come with a confirmation similar to:
```
/home/bernd/projects/Orca/desktop/sources/scripts/io.js:62 Set device to #1 — TiMidity port 0
```

Now close the web console window.

### Open an example
Hit `ctrl+o` in ORCΛ to get a dialog for opening a `.orca` file.
There is the `example` directory in your `Orca` folder.
Choose the `_midi.orca` file in that directory and you should hear four notes playing in a loop!

## Orca's OSC Guide
The [OSC](https://github.com/MylesBorins/node-osc) operator `=` takes one haste input that is **a string length** and locks the eastwardly ports and sends an OSC message on bang to the port `12000` on `localhost` by default and can be configured in [oscConfig.js](https://github.com/hundredrabbits/Orca/blob/master/desktop/core/bridge/oscConfig.js).  
The OSC operator `=` offers different usages, from its the most simple: `2=yo` will send `/yo` to `127.0.0.1:12000`.  
The [oscConfig.js](https://github.com/hundredrabbits/Orca/blob/master/desktop/core/bridge/oscConfig.js) file can also be modified to add predefined messages in `defs`. Each definition can take different options:
- `path`: path to use for the OSC message
    ```js
    defs: {
        myKey: { 
            path: '/Hello/Orca'
        }
    }
    ```
    `5=myKey` will send `/Hello/Orca` to `127.0.0.1:12000`

- `pattern`: used to send values. Support integers, floats and strings values
    ```js
    defs: {
        A: {
            pattern: 'i' // send an integer
        },
        B: {
            pattern: 'f' // send a float (divides input value by 10)
        },
        C: {
            pattern: 's' // send a string
        }
    }
    ```
    `5=A 135` will send `/A` and the value `135` to `127.0.0.1:12000`  
    `5=B 135` will send `/B` and the value `13.5` to `127.0.0.1:12000`  
    `5=C 135` will send `/C` and the value `'135'` to `127.0.0.1:12000`

    `pattern` can also be used to send mutliple values
    ```js
    defs: {
        D: {
            pattern: 'ifs' // integer, float, string
        }
    }
    ```
    `9=D 3 12 yo` will send `/D` and the values `3`, `1.2`, `"yo"` to `127.0.0.1:12000`
- `address` and `port`: used to configure alternate servers address or port
    ```js
    defs: {
        E: {
            address: '192.168.0.12',
            port: '6010'
        }
    }
    ```
    `1=E` will send `/E` to `192.168.0.12:6010`

You can use the [oscListener.js](https://github.com/hundredrabbits/Orca/blob/master/examples/OSC/oscListener.js) to test OSC messages (needs [node-osc](https://github.com/MylesBorins/node-osc): `cd examples/OSC && npm i`). See it in action with [osc.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/OSC/_osc.orca) and [oscConfig.js](https://github.com/hundredrabbits/Orca/blob/master/desktop/core/bridge/oscConfig.js).

## FAQs

### Set Device Id

To set the Midi device, open the console with `ctrl+.`, and type `terminal.io.listMidiDevices()` to see the list of available devices, and type `terminal.io.setMidiDevice(2)` to select the 2nd available device. This will be improved soon.
