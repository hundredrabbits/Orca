# ORCΛ

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/logo.png?v=1' width="600"/>

**Each letter of the alphabet is an operation**, <br />lowercase letters operate on bang, uppercase letters operate each frame. 

**To learn more**, have a look at some projects created with [#ORCΛ](https://twitter.com/hashtag/ORCΛ), watch the [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE), or check out the [examples](https://github.com/hundredrabbits/Orca/tree/master/examples) & [tutorials](TUTORIAL.md). If you need some help, visit the [forum](https://llllllll.co/t/orca-live-coding-tool/17689), or the [chatroom](https://talk.lurk.org/channel/orca). 

If you're looking for a **portable distribution**, visit [Orca-c](http://github.com/hundredrabbits/Orca-c). 

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/orca) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Orca.git
cd Orca/desktop/
npm install
npm start
```

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/preview.jpg' width="600"/>

## Operators

- `A` **add**: Outputs the sum of inputs.
- `B` **bounce**: Bounces between two values based on the runtime frame.
- `C` **clock**: Outputs a constant value based on the runtime frame.
- `D` **delay**: Bangs on a fraction of the runtime frame.
- `E` **east**: Moves eastward, or bangs.
- `F` **if**: Bangs if both inputs are equal.
- `G` **generator**: Writes distant operators with offset.
- `H` **halt**: Stops southward operators from operating.
- `I` **increment**: Increments southward operator.
- `J` **jumper**: Outputs the northward operator.
- `K` **konkat**: Outputs multiple variables.
- `L` **loop**: Loops a number of eastward operators.
- `M` **multiply**: Outputs the product of inputs.
- `N` **north**: Moves Northward, or bangs.
- `O` **read**: Reads a distant operator with offset.
- `P` **push**: Writes an eastward operator with offset.
- `Q` **query**: Reads distant operators with offset.
- `R` **random**: Outputs a random value.
- `S` **south**: Moves southward, or bangs.
- `T` **track**: Reads an eastward operator with offset.
- `U` **uclid**: Bangs at a rate defined by the [Euclidean pattern](http://www-cgrl.cs.mcgill.ca/~godfried/publications/banff.pdf).
- `V` **variable**: Reads and write globally available variables.
- `W` **west**: Moves westward, or bangs.
- `X` **write**: Writes a distant operator with offset.
- `Y` **jymper**: Outputs the westward operator.
- `Z` **lerp**: Transitions southward operator toward input.
- `*` **bang**: Bangs neighboring operators.
- `#` **comment**: Comments a line, or characters until the next hash.

### IO

#### Send

- `:` **midi**: Sends a MIDI note.
- `!` **cc**: Sends a MIDI CC value.
- `%` **mono**: Sends a Monophonic MIDI value.
- `;` **udp**: Sends a UDP message.
- `=` **osc**: Sends a OSC message.

#### Receive

- `&` **keys**: Receives a MIDI note.

## MIDI

The [MIDI](https://en.wikipedia.org/wiki/MIDI) operator `:` takes up to 5 inputs('channel, 'octave, 'note, velocity, length). 

For example, `:25C`, is a **C note, on the 5th octave, through the 3rd MIDI channel**, `:04c`, is a **C# note, on the 4th octave, through the 1st MIDI channel**. Velocity is an optional value from `0`(0/127) to `g`(127/127). Note length is the number of frames during which a note remains active. See it in action with [midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca).

## MIDI MONO

The [MONO](https://en.wikipedia.org/wiki/Monophony) operator `%` takes up to 5 inputs('channel, 'octave, 'note, velocity, length). 

This operator is very similar to the default Midi operator, but **each new note will stop the previously playing note**, would its length overlap with the new one. Making certain that only a single note is ever played at once, this is ideal for monophonic analog synthetisers that might struggle to dealing with chords and note overlaps.

## MIDI CC

The [MIDI CC](https://www.sweetwater.com/insync/continuous-controller/) operator `!` takes 3 inputs('channel, 'knob, 'value).

It sends a value **between 0-127**, where the value is calculated as a ratio of 36, over a maximum of 127. For example, `!008`, is sending **28**, or `(8/36)*127` through the first channel, to the control mapped with `id0`. You can press **enter**, with the `!` operator selected, to assign it to a controller.

## UDP

The [UDP](https://nodejs.org/api/dgram.html#dgram_socket_send_msg_offset_length_port_address_callback) operator `;` locks each consecutive eastwardly ports. For example, `;hello`, will send the string "hello", on bang, to the port `49160` on `localhost`. In console, use `terminal.io.udp.select()` to select a **custom UDP port**.

You can use the [listener.js](https://github.com/hundredrabbits/Orca/blob/master/listener.js) to test UDP messages. See it in action with [udp.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_udp.orca).

## OSC

The [OSC](https://github.com/MylesBorins/node-osc) operator `=` locks each consecutive eastwardly ports. The first character is used for the path, the following characters are sent as integers using the [base36 Table](https://github.com/hundredrabbits/Orca#base36-table). In console, use `terminal.io.osc.select()` to select a **custom osc port**.

For example, `=1abc` will send `10`, `11` and `12` to `/1`, via the port `49162` on `localhost`; `=a123` will send `1`, `2` and `3`, to the path `/a`. You can use the [listener.js](https://github.com/hundredrabbits/Orca/blob/master/listener.js) to test OSC messages. See it in action with [osc.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_osc.orca) or try it with [SonicPi](https://github.com/hundredrabbits/Orca/blob/master/TUTORIAL.md#sonicpi).

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/preview.hardware.jpg' width="600"/>

## Advanced Controls

Some of Orca's features can be **controlled externally** via UDP though port `49160`, or via its own command-line interface. To activate the command-line prompt, press `CmdOrCtrl+K`. The prompt can also be used to inject patterns, files that are located at the same location as the open file, see `get:`.

### Default Ports

| UDP Input  | OSC Input  | UDP Output | OSC Output |
| ---------- | ---------- | ---------- | -----------|
| 49160      | None       | 49161      | 49162

### Commands

All commands have a shorthand equivalent to their first character, for example, `write` can also be called using `w`.

- `play` Plays program.
- `stop` Stops program.
- `run` Runs current frame.
- `time:0` Sets the frame value to `0`.
- `find:aV` Sends cursor to string `aV`.
- `move:3;4` Move cursor to position `3,4`.
- `bpm:140` Sets bpm speed to `140`.
- `apm:160` Animates bpm speed to `160`.
- `inject:pattern` Inject the local file `pattern.orca`.
- `graphic:123` Set the background to the local graphic `123.jpg`.
- `write:H12;34` Writes glyph `H`, at `12,34`.
- `color:f00;0f0;00f` Colorizes the interface.

### Project Mode

You can **quickly inject orca files** into the currently active file, by using the command-line prompt — Allowing you to navigate across multiple files like you would a project. Type `CmdOrCtrl+K` and the name of another `.orca` file, **located in the same folder** as the opened file, to paste it into the current patch.

## Base36 Table

Orca operates on a base of **36 increments**. Operators using numeric values will typically also operate on letters and convert them into values as per the following table. For instance `Dp` will bang every *24th frame*. 

| **0** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **A** | **B**  | 
| :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:    | 
| 0     | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10    | 11     |
| **C** | **D** | **E** | **F** | **G** | **H** | **I** | **J** | **K** | **L** | **M** | **N**  |
| 12    | 13    | 14    | 15    | 16    | 17    | 18    | 19    | 20    | 21    | 22    | 23     |
| **O** | **P** | **Q** | **R** | **S** | **T** | **U** | **V** | **W** | **X** | **Y** | **Z**  | 
| 24    | 25    | 26    | 27    | 28    | 29    | 30    | 31    | 32    | 33    | 34    | 35     |

## Transpose Table

The midi operator interprets any letter above the chromatic scale as a transpose value, for instance `3H`, is equivalent to `4A`.

| **0** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **A** | **B**  | 
| :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:    | 
| _     | _     | _     | _     | _     | _     | _     | _     | _     | _     | A0    | B0     |
| **C** | **D** | **E** | **F** | **G** | **H** | **I** | **J** | **K** | **L** | **M** | **N**  |
| C0    | D0    | E0    | F0    | G0    | A0    | B0    | C1    | D1    | E1    | F1    | G1     | 
| **O** | **P** | **Q** | **R** | **S** | **T** | **U** | **V** | **W** | **X** | **Y** | **Z**  | 
| A1    | B1    | C2    | D2    | E2    | F2    | G2    | A2    | B2    | C3    | D3    | E3     | 

## Companion Applications

- [PILOT](https://github.com/hundredrabbits/pilot), a companion synth tool.
- [AIOI](https://github.com/MAKIO135/aioi), a companion to send complex OSC messages.
- [ESTRA](https://github.com/kyleaedwards/estra), a companion sampler tool.

## Tutorials

- [Japanese](https://qiita.com/rucochanman/items/98a4ea988ae99e04b333)
- [German](http://tropone.de/2019/03/13/orca-ein-sequenzer-der-kryptischer-nicht-aussehen-kann-und-ein-versuch-einer-anleitung/)
- [French](http://makingsound.fr/blog/orca-sequenceur-modulaire/)

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
