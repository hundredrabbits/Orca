# ORCΛ

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/logo.png' width="600"/>

**Each letter of the alphabet is an operation**, lowercase letters operate on bang(`*`), uppercase letters operate each frame. Have a look at some project created with [#ORCΛ](https://twitter.com/hashtag/ORCΛ), or some [example files](https://github.com/hundredrabbits/Orca/tree/master/examples). Here's an [introduction video](https://www.youtube.com/watch?v=RaI_TuISSJE).

## Install & Run

You can download [builds](https://hundredrabbits.itch.io/orca) for **OSX, Windows and Linux**, or if you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Orca.git
cd Orca/desktop/
npm install
npm start
```

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/preview.jpg' width="600"/>

## Quickstart

You can follow the [guide](GUIDE.md) to get started and play your first sounds. You can see the [design notes](DESIGN.md) for specs and upcoming features.

## Operators

- `A` **add**(a, b): Outputs the sum of inputs.
- `B` **bool**(val): Bangs if input is not empty, or 0.
- `C` **clock**('rate, mod): Outputs a constant value based on the runtime frame.
- `D` **delay**('rate, mod): Bangs on a fraction of the runtime frame.
- `E` **east**: Moves eastward, or bangs.
- `F` **if**(a, b): Bangs if both inputs are equal.
- `G` **generator**('x, 'y, 'len): Writes distant operators with offset.
- `H` **halt**: Stops southward operators from operating.
- `I` **increment**(min, max): Increments southward operator.
- `J` **jumper**(val): Outputs the northward operator.
- `K` **kill**: Kills southward operator.
- `L` **loop**('len): Loops a number of eastward operators.
- `M` **modulo**(val, mod): Outputs the modulo of input.
- `N` **north**: Moves Northward, or bangs.
- `O` **offset**('x, 'y, val): Reads a distant operator with offset.
- `P` **push**('len, 'key, val): Writes an eastward operator with offset.
- `Q` **query**('x, 'y, 'len): Reads distant operators with offset.
- `R` **random**(min, max): Outputs a random value.
- `S` **south**: Moves southward, or bangs.
- `T` **track**('len, 'key, val): Reads an eastward operator with offset.
- `U` **uturn**('n, 'e, 's, 'w): Reverses movement of inputs.
- `V` **variable**('write, read): Reads and write globally available variables.
- `W` **west**: Moves westward, or bangs.
- `X` **teleport**('x, 'y, val): Writes a distant operator with offset.
- `Y` **jymper**(val): Outputs the westward operator.
- `Z` **zoom**: Moves eastwardly, respawns west on collision.
- `*` **bang**: Bangs neighboring operators.
- `#` **comment**: Comments a line, or characters until the next hash.
- `:` **midi**('channel, 'octave, 'note, velocity, length): Sends a MIDI note.
- `;` **udp**('len): Sends a UDP. message.
- `=` **osc**('pathlen, 'msglen): Sends a OSC message.

## Controls

### Terminal Controls

- `enter` toggle insert/write.
- `space` toggle play/pause.
- `>` increase BPM.
- `<` decrease BPM.
- `shift+arrowKey` Expand cursor.
- `ctrl+arrowKey` Leap cursor.
- `alt+arrowKey` Move selection.

### Edit

- `ctrl+c` copy selection.
- `ctrl+x` cut selection.
- `ctrl+v` paste selection.
- `ctrl+z` undo.
- `ctrl+shift+z` redo.

### Grid Controls

- `]` increase grid size vertically.
- `[` decrease grid size vertically.
- `}` increase grid size horizontally.
- `{` decrease grid size horizontally.
- `ctrl/meta+]` increase program size vertically.
- `ctrl/meta+[` decrease program size vertically.
- `ctrl/meta+}` increase program size horizontally.
- `ctrl/meta+{` decrease program size horizontally.

### Window

- `ctrl+=` Zoom In.
- `ctrl+-` Zoom Out.
- `ctrl+0` Zoom Reset.
- `tab` Toggle interface.
- `backquote` Toggle background.

To open the console, press `ctrl+.`.

## MIDI

The [MIDI](https://en.wikipedia.org/wiki/MIDI) operator `:` takes up to 5 inputs('channel, 'octave, 'note, velocity, length). 

For example, `:25C`, is a **C note, on the 5th octave, through the 3rd MIDI channel**, `:04c`, is a **C# note, on the 4th octave, through the 1st MIDI channel**. Velocity is an optional value from `0`(0/127) to `f`(127/127). Note length is a value from `0`(1/16) to `f`(16/16), which is a ratio of a full bar, *f* being `16/16`(a full bar), *8* being `1/2`(half), *4* being `1/4`(quarter). See it in action with [midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca).

#### List Midi Devices

In console, type `terminal.io.midi.list()` to see the list of available midi devices.

#### Select Midi Device

In console, type `terminal.io.midi.select(1)` to select the second midi device.

## UDP

The [UDP](https://nodejs.org/api/dgram.html#dgram_socket_send_msg_offset_length_port_address_callback) operator `;` takes one haste input('length) and locks that number of eastwardly ports. 

It sends the message on bang to the port `49160` on `localhost`. You can use the [listener.js](https://github.com/hundredrabbits/Orca/blob/master/listener.js) to test UDP messages. See it in action with [udp.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_udp.orca).

#### Select UDP Port

In console, type `terminal.io.udp.select(49160)` to select the **49160** udp port.

## OSC

The [OSC](https://github.com/MylesBorins/node-osc) operator `=` takes two haste inputs('pathlen, 'msglen) and lock that cumulative number of eastwardly ports. 

For example, `c0=/hello/world` will send an empty message(bang) to the path `/hello/world`, to the port `49162` on `localhost`. Or, `44=/foo123f` will send the float `0.123`, to the path `/foo`. The operation `44=/bar1234` will send the int `1234`, to the path `/bar` The operator supports *integers*, *float*, *strings*. You can use the [listener.js](https://github.com/hundredrabbits/Orca/blob/master/examples/listener.js) to test OSC messages. See it in action with [osc.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_osc.orca), or [learn more](https://github.com/hundredrabbits/Orca/blob/master/GUIDE.md#orcas-osc-guide).

#### Select OSC Port

In console, type `terminal.io.osc.select(49162)` to select the **49162** osc port.

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/preview.hardware.jpg' width="600"/>

## Base36 Table

Orca operates on a base of 36 increments. Operators using numeric values will typically also operate on letters and convert them into values as per the following table. For instance `Dp` will bang every *24th frame*.

| 0     | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | A     | B      | 
| :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:    | 
| 0     | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10    | 11     |
| **C** | **D** | **E** | **F** | **G** | **H** | **I** | **J** | **K** | **L** | **M** | **N**  |
| 12    | 13    | 14    | 15    | 16    | 17    | 18    | 19    | 20    | 21    | 22    | 23     | 
| **O** | **P** | **Q** | **R** | **S** | **T** | **U** | **V** | **W** | **X** | **Y** | **Z**  | 
| 24    | 25    | 26    | 27    | 28    | 29    | 30    | 31    | 32    | 33    | 34    | 35     |

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
