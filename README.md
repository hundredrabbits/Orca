# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Functions

### alpha functions

- `A` **add**(a, b): Creates the result of the addition of east and west fns, southward.
- `B` **unknown**: --
- `C` **clock**(min, max): Adds a constant value southward.
- `D` **raycast**: Sends a bang to the nearest fn following the direction of the bang.
- `E` **east**: Moves eastward, or bangs.
- `F` **if**(a, b): Bangs if east and west fns are equal, southward.
- `G` **generator**: Generates a S fn southward, on bang.
- `H` **halt**: Stops southward fn from operating.
- `I` **increment**(min, max, mod): Increments southward numeric fn on bang.
- `J` **jump**(val): Copies the northward fn, southwardly.
- `K` **kill**: Kills southward fns, on bang.
- `L` **loop**(_len): Loop a number of characters ahead.
- `M` **modulo**(val, mod): Creates the result of the modulo operation of east and west fns, southward.
- `N` **north**: Moves Northward, or bangs.
- `O` **offset**(_x, _y, val): Reads a distant fn with offset.
- `P` **push**: Pushes neighboring direction fns away.
- `Q` **count**(_len): Count the number of fns present eastwardly.
- `R` **random**(min, max): Outputs a random value southward.
- `S` **south**: Moves southward, or bangs.
- `U` **track**(_len, _key, val): Reads character at eastward position.
- `U` **unknown**: --
- `V` **beam**: Bang the nearest southward fn.
- `W` **west**: Moves westward, or bangs.
- `X` **unknown**: --
- `Y` **type**(a, b): Compares the type(num/alpha/special) of westward and eastward fns, and return 1 or 0 southward.
- `Z` **unknown**: --

### special functions

- `.` **null**: void
- `*` **bang**: Bangs!
- `:` **midi**(channel, octave, note): Sends Midi
- `;` **comment**: Block Comment

## Midi Output

The midi special function is `:000`, it requires 3 inputs(channel, octave, note). For example, `:25C`, is a **C note, on the 5th octave, through the 3rd MIDI channel**, `:04c`, is a **C# note, on the 4th octave, through the 1st MIDI channel**.

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

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
