# Guide

Orca is **not a synth**, but a [livecoding environment](https://www.reddit.com/r/livecoding/) to write procedural sequencers. In other words, **Orca is meant to control other applications** such as a DAW(Ableton, Renoise, VCV Rack, etc.), or an audio server such as SuperCollider.

## FAQs

### List Midi Devices

Open the console with `ctrl+.`, and type `terminal.io.midi.list()` to see the list of available devices.

### Select Midi Device

Open the console with `ctrl+.`, and type `terminal.io.midi.select(0)` to select the 1st available device, `terminal.io.midi.select(1)` to select the 2nd available device, and so on. Alternatively, type `terminal.io.midi.next()`.

## OSX

### Ableton Live

To control instruments in [Ableton Live](https://www.ableton.com/en/), launch [Orca](README.md) and open [examples/midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca).

- Launch Ableton Live.
- Create a new midi instrument track.
- Select `IAC Driver(Bus 1)` in the instrument's inputs dropdown. 
- Activate the **In** toggle. 

The midi instrument should begin receiving midi notes as soon as the Orca window is **back into focus**.

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
