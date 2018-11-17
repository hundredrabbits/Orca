# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Functions

### alpha functions

- `A`, **add**: Creates the result of the addition of east and west fns, southward.
- `B`, **banger**: Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` northward.
- `C`, **clock**: Adds a constant value southward.
- `D`, **raycast**: Sends a bang to the nearest fn following the direction of the bang.
- `E`, **east**: Moves eastward, or bangs.
- `F`, **if**: Bangs if east and west fns are equal, southward.
- `G`, **generator**: Generates a S fn southward, on bang.
- `H`, **halt**: Stops southward fn from operating.
- `I`, **increment**: Increments southward numeric fn on bang.
- `J`, **jump**: Copies the northward fn, southwardly.
- `K`, **kill**: Kills southward fns, on bang.
- `L`, **loop**: Loop a number of characters ahead.
- `M`, **modulo**: Creates the result of the modulo operation of east and west fns, southward.
- `N`, **north**: Moves Northward, or bangs.
- `O`, **unknown**: Missing docs.
- `P`, **push**: Pushes neighboring direction fns away.
- `Q`, **count**: Count the number of fns present eastwardly.
- `R`, **random**: Outputs a random value southward.
- `S`, **south**: Moves southward, or bangs.
- `T`, **track**: Reads character at eastward position.
- `U`, **unknown**: Missing docs.
- `V`, **unknown**: Missing docs.
- `W`, **west**: Moves westward, or bangs.
- `X`, **split**: Bangs eastward when westward fn is 0, and southward when fn is 1.
- `Y`, **type**: Compares the type(num/alpha/special) of westward and eastward fns, and return 1 or 0 southward.
- `Z`, **unknown**: Missing docs.

### special functions

- `.`, **null**: void
- `*`, **bang**: Bangs!
- `:`, **midi**: Sends Midi
- `;`, **comment**: Block Comment

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

## Ports Specs

```
Haste < Function > Input(s)
           v
        Output
```

- **Haste port** values are collected before runtime.
- **Inputs** are collected at normal runtime.
- **Outputs**.

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

- Random value node.

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
