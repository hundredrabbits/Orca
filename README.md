# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Programs

### num functions

- `0`, **null**: void
- `1`, **null**: void
- `2`, **null**: void
- `3`, **null**: void
- `4`, **null**: void
- `5`, **null**: void
- `6`, **null**: void
- `7`, **null**: void
- `8`, **null**: void
- `9`, **null**: void

### alpha functions

- `A`, **add**: Creates the result of the addition of east and west fns, southward.
- `B`, **bang**: The bang is used to trigger various fns, only lasts one cycle.
- `C`, **clamp**: [FIX]Clamp the northern fn between the westward and eastward fn bang.
- `D`, **deflect**: [FIX]Converts neighboors into direction fns.
- `E`, **east**: Moves eastward, or bangs.
- `F`, **if**: Bangs if east and west fns are equal, southward.
- `G`, **generator**: [FIX]Generates a direction fn from bang.
- `H`, **halt**: Stops southward fn from operating.
- `I`, **increment**: Increments southward numeric fn on bang.
- `J`, **jump**: Copies the northward fn, southwardly.
- `K`, **kill**: [TODO]Kills southward fns, on bang.
- `L`, **loop**: Loop a number of characters ahead.
- `M`, **modulo**: Creates the result of the modulo operation of east and west fns, southward.
- `N`, **north**: Moves Northward, or bangs.
- `O`, **odd**: Adds 0 southward, transforms into Q on bang.
- `P`, **push**: Moves away, on bang.
- `Q`, **even**: Adds 1 southward, transforms into O on bang.
- `R`, **raycast**: Sends a bang to the nearest fn following the direction of the bang.
- `S`, **south**: Moves southward, or bangs.
- `T`, **trigger**: Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` northward.
- `U`, **idle**: [TODO]Nothing..
- `V`, **value**: Creates a numerical value between 0 and 5 based on the number of present _fns_ westward.
- `W`, **west**: Moves westward, or bangs.
- `X`, **split**: [FIX]Bangs eastward when westward fn is 0, and southward when fn is 1.
- `Y`, **type**: Compares the type(num/alpha/special) of westward and eastward fns, and return 1 or 0 southward.
- `Z`, **creep**: Moves to a the next available location in a cycle of E, S, W, N based on the runtime frame.

### special functions

- `.`, **null**: void
- `:`, **query**: Call a function by name, freezes 3 characters eastward.
- `-`, **wire-h**: Send data along the wire, horizontally.
- `|`, **wire-v**: Send data along the wire, vertically.
- `*`, **wire-n**: Send data along the wire, entry or exit.
- `+`, **wire-f**: Send data along the wire, across an intersection.

### queries functions

- `BPM`, **bpm**: Sets the speed for the Pico terminal.
- `VOL`, **volume**: Sets the volume for the Pico terminal.
- `QQQ`, **qqq**: Plays note, on channel, with octave.

## Logic Functions

The logic functions are passive, and they are `a`, `f`, `m`, `y`.

## CLI

```
node cli # New file
node cli examples/benchmark.pico # Load example
```

## Install

```
cd desktop
npm install
npm start
```

## Notes

- `0x92 & 0xf0 = 144`, Ch3 noteOn
- `0x80 & 0xf0 = 128`, Ch1 noteOff

```
function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}
```

- Note values are on a range from 0–127, lowest to highest. For example, the lowest note on an 88-key piano has a value of 21, and the highest note is 108. A “middle C” is 60.
- Velocity values are also given on a range from 0–127 (softest to loudest). The softest possible “note on” velocity is 1.

## TODO

The idea is to build a synth/mini sequencer, here's some tasks I need to tackle before then.

- [ ] Add `:MID[CD]`
- [ ] custom synth functions, like `:SYN[ADSR](C)`
- [ ] sub programs scope
- [ ] Implement midi
- [ ] Finish midi channel implementation
- [ ] Convert notes to midi values


## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
