# ORCΛ

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/logo.png' width="600"/>

**Each letter of the alphabet is an operation**, lowercase letters operate on bang(`*`), uppercase letters operate each frame. Bangs can be generated by various operations, such as `E` colliding with a `0`, see the [bang.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/bang.orca) example. See some project created with [#ORCΛ](https://twitter.com/hashtag/ORCΛ).

## Install & Run

You can download builds for OSX, Windows and Linux [here](https://hundredrabbits.itch.io/orca). If you wish to build it yourself, follow these steps:

```
git clone https://github.com/hundredrabbits/Orca.git
cd Orca/desktop/
npm install
npm start
```

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/preview.jpg' width="600"/>

## Quickstart

You can follow the [guide](GUIDE.md) to get started and play your first sounds. You can see the [design notes](DESIGN.md) for specs and upcoming features.

## Functions

- `A` **add**(a, b): Outputs the sum of inputs.
- `B` **banger**(val): Bangs if input is `1`, `N`, `S`, `W`, `E` or `Z`.
- `C` **clock**('rate, mod): Outputs a constant value based on the runtime frame.
- `D` **delay**('rate, offset): Bangs on a fraction of the runtime frame.
- `E` **east**: Moves eastward, or bangs.
- `F` **if**(a, b): Outputs `1` if inputs are equal, otherwise `0`.
- `G` **generator**('x, 'y, 'len): Writes distant operators with offset.
- `H` **halt**('len): Stops southward operators from operating.
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
- `Z` **diagonal**: Moves diagonally toward south-east.
- `*` **bang**: Bangs neighboring operators.
- `;` **udp**('len): Sends a string via UDP to localhost.
- `:` **midi**('velocity, 'length, channel, octave, note): Sends Midi a midi note.
- `!` **keys**(key): Bangs on keyboard input.
- `#` **comment**: Comments a line, or characters until the next hash.

## Controls

### Terminal Controls

- `enter` toggle insert/write.
- `space` toggle play/pause.
- `/` toggle insert/keys.
- `shift+arrow` resize cursor size.
- `ctrl/meta+arrow` jump cursor position.
- `>` increase BPM.
- `<` decrease BPM.

### Edit

- `ctrl+c` copy selection.
- `ctrl+x` cut selection.
- `ctrl+v` paste selection.
- `ctrl+z` undo.
- `ctrl+shift+z` redo.
- `ctrl/meta+k` crop.

### Grid Controls

- `]` increase grid size vertically.
- `[` decrease grid size vertically.
- `}` increase grid size horizontally.
- `{` decrease grid size horizontally.
- `ctrl/meta+]` increase program size vertically.
- `ctrl/meta+[` decrease program size vertically.
- `ctrl/meta+}` increase program size horizontally.
- `ctrl/meta+{` decrease program size horizontally.

## Special Operators

### Midi Output

The midi operator `:` takes up to 5 inputs('channel, 'octave, 'note, velocity, length). For example, `:25C`, is a **C note, on the 5th octave, through the 3rd MIDI channel**, `:04c`, is a **C# note, on the 4th octave, through the 1st MIDI channel**. See it in action with [midi.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_midi.orca).

#### Velocity*

Velocity is either from `0-9`(10 steps), or `A-Z`(26 steps). For example, `:34C8`, is a **C note, on the 4th octave, through the 4th MIDI channel with a velocity of 112/127(88%)**, `:34CT`, is a **C note, on the 4th octave, through the 4th MIDI channel with a velocity of 96/127(75%)**. 

#### Note Length*

Note length is a value from `1-f`, which is a ratio of a full bar, *1* being `1/1`(a full bar), *2* being `1/2`(half), *3* being `1/3`(third).. and *f* being `1/16`. For example, `:27FZ4`, is a **F note, on the 7th octave, through the 3rd MIDI channel with a velocity of 100%, lasting for 1/4 of a bar**. 

### UDP Output

The [UDP](https://nodejs.org/api/dgram.html#dgram_socket_send_msg_offset_length_port_address_callback) operator `;`, takes one haste input that is a string length and locks the eastwardly ports. It sends the message on bang to the port `49160`. You can use the [listener.js](https://github.com/hundredrabbits/Orca/blob/master/listener.js) to test UDP messages. See it in action with [udp.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_udp.orca).

### Keyboard Input

The keys operator `!` will bang on a corresponding keyboard keypress when the cursor is in **keyboard mode**(toggle with `/`). For instance, `!a`, will output a bang when pressing the `a` key in **keyboard mode**. See it in action with the [keys.orca](https://github.com/hundredrabbits/Orca/blob/master/examples/_keys.orca).

<img src='https://raw.githubusercontent.com/hundredrabbits/Orca/master/resources/preview.hardware.jpg' width="600"/>

## Base36 Table

Orca operates on a base of 36 increments. Operators using numeric values will typically also operate on letters and convert them into values as per the following table. For instance `pD` will bang every *24th frame*.

| 0     | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | A     | B      | 
| :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:    | 
| 0     | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10    | 11     |
| **C** | **D** | **E** | **F** | **G** | **H** | **I** | **K** | **L** | **M** | **N** | **O**  |
| 12    | 13    | 14    | 15    | 16    | 17    | 18    | 19    | 20    | 21    | 22    | 23     | 
| **P** | **Q** | **R** | **S** | **T** | **U** | **V** | **W** | **X** | **Y** | **Z** | **\*** | 
| 24    | 25    | 26    | 27    | 28    | 29    | 30    | 31    | 32    | 33    | 34    | 35     |

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
