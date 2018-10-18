# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Functions

### alpha functions

- `A`, **add**(math): Creates the result of the addition of east and west fns, southward.
- `B`, **<missing name>**: Missing docs.
- `C`, **count**(list): Count the number of fns present eastwardly.
- `D`, **<missing name>**: Missing docs.
- `E`, **east**(direction): Moves eastward, or bangs.
- `F`, **if**(math): Bangs if east and west fns are equal, southward.
- `G`, **generator**(transport): Generates a direction fn from bang.
- `H`, **halt**(stopper): Stops southward fn from operating.
- `I`, **increment**(trigger): Increments southward numeric fn on bang.
- `J`, **jump**: Copies the northward fn, southwardly.
- `K`, **kill**(trigger): Kills southward fns, on bang.
- `L`, **loop**(list): Loop a number of characters ahead.
- `M`, **modulo**(math): Creates the result of the modulo operation of east and west fns, southward.
- `N`, **north**(direction): Moves Northward, or bangs.
- `O`, **<missing name>**: Missing docs.
- `P`, **<missing name>**: Missing docs.
- `Q`, **query**: Call a function by name, freezes 3 characters eastward.
- `R`, **raycast**(transport): Sends a bang to the nearest fn following the direction of the bang.
- `S`, **south**(direction): Moves southward, or bangs.
- `T`, **trigger**: Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` northward.
- `U`, **<missing name>**: Missing docs.
- `V`, **<missing name>**: Missing docs.
- `W`, **west**(direction): Moves westward, or bangs.
- `X`, **split**: Bangs eastward when westward fn is 0, and southward when fn is 1.
- `Y`, **type**(math): Compares the type(num/alpha/special) of westward and eastward fns, and return 1 or 0 southward.
- `Z`, **creep**: Moves to a the next available location in a cycle of E, S, W, N based on the runtime frame.

### special functions

- `.`, **null**: void
- `*`, **bang**: Bangs!

### queries functions

- `BPM`, **bpm**(midi): Sets the speed for the Pico terminal.
- `VOL`, **volume**(midi): Sets the volume for the Pico terminal.
- `QQQ`, **qqq**(midi): Plays note, on channel, with octave.

### Functions(By Type)

- **maths**: `a` `f` `m` `y`.
- **miscs**: `b` `d` `j` `o` `p` `Q` `t` `u` `v` `x` `z` `.` `*`.
- **lists**: `c` `l`.
- **directions**: `e` `n` `s` `w`.
- **transports**: `g` `r`.
- **stoppers**: `h`.
- **triggers**: `i` `k`.

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
- [ ] Implement a block comment syntax
- [ ] Fix M

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
