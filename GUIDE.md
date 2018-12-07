# Guide

## Base36 Table

Orca operates on a base of 36 increments. Operators using numeric values will typically also operate on letters and convert them into values as per the following table.

| 0  | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | A  | B  | 
| -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | 
| 0  | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 |
| C  | D  | E  | F  | G  | H  | I  | K  | L  | M  | N  | O  |
| 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 
| P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | *  | 
| 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 |

## Platforms 

### Ubuntu

This a guide to help you produce your first sounds with ORCΛ, tested on `Ubuntu 18.04`.

## Installations

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

### Install node

If you don't have `node` installed yet, install it with:

```
sudo apt-get install nodejs
```

### Install ORCΛ

Next install ORCΛ as described in the [Readme](README.md):

```
git clone https://github.com/hundredrabbits/Orca.git
cd Orca/desktop/
npm install
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
