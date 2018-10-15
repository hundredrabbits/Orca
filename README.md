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
- `C`, **clone**: Clones the westward fn, eastwardly, on bang.
- `D`, **deflect**: Converts neighboors into direction fns.
- `E`, **east**: Moves eastward, or bangs.
- `F`, **if**: Bangs if east and west fns are equal, southward.
- `G`, **generator**: Generates a s on bang.
- `H`, **halt**: Stops southward fn from operating.
- `I`, **increment**: Increments southward numeric fn on bang.
- `J`, **jump**: [TODO]Moves the westward fn to eastward, or the eastward fn westward, on bang.
- `K`, **kill**: [TODO]Kills southward fns, on bang.
- `L`, **idle**: [todo]Nothing.
- `M`, **modulo**: Creates the result of the modulo operation of east and west fns, southward.
- `N`, **north**: Moves Northward, or bangs.
- `O`, **odd**: Adds 0 southward, transforms into Q on bang.
- `P`, **push**: Moves away, on bang.
- `Q`, **even**: Adds 1 southward, transforms into O on bang.
- `R`, **raycast**: Sends a bang to the nearest fn following the direction of the bang.
- `S`, **south**: Moves southward, or bangs.
- `T`, **trigger**: Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` westward.
- `U`, **idle**: [TODO]Nothing..
- `V`, **value**: Creates a numerical value between 0 and 5 based on the number of present _fns_ westward.
- `W`, **west**: Moves westward, or bangs.
- `X`, **split**: Bangs eastward when westward fn is 0, and southward when fn is 1.
- `Y`, **type**: Compares the type(num/alpha/special) of westward and eastward fns, and return 1 or 0 southward.
- `Z`, **creep**: Moves to a the next available location in a cycle of E, S, W, N based on the runtime frame.

### special functions

- `.`, **null**: void
- `:`, **null**: Call a function by name, freeze 3 characters eastward.
- `-`, **wire-h**: Send data along the wire, horizontally.
- `|`, **wire-v**: Send data along the wire, vertically.
- `*`, **wire-n**: Send data along the wire, entry or exit.
- `+`, **wire-f**: Send data along the wire, across an intersection.

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

## TODO

The idea is to build a synth/mini sequencer, here's some tasks I need to tackle before then.

[ ] Migrate Electron build to new core.
[ ] custom synth functions, like `:SYN[ADSR](C)`
[ ] "I wanna be able to 1000x fastforward my pico programs"
[ ] sub programs scope
[ ] block copy-paste
[ ] `BPM000` method

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
