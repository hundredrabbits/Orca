# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Programs

### num functions
- `0`, **null**: Missing docs.
- `1`, **null**: Missing docs.
- `2`, **null**: Missing docs.
- `3`, **null**: Missing docs.
- `4`, **null**: Missing docs.
- `5`, **null**: Missing docs.
- `6`, **null**: Missing docs.
- `7`, **null**: Missing docs.
- `8`, **null**: Missing docs.
- `9`, **null**: Missing docs.

### alpha functions
- `A`, **add**: Creates the result of the addition of east and west fns, southward.
- `B`, **bang**: The **bang** is used to trigger various _fns_, only lasts one cycle.
- `C`, **clone**: Clones the westward _fn__, eastwardly, on **bang**.
- `D`, **deflect**: Converts neighboors into direction functions.
- `E`, **east**: Moves eastward, or bangs.
- `F`, **if**: Bangs if east and west _fns_ are equal, southward.
- `G`, **generator**: Generates a `D` on **bang**.
- `H`, **halt**: Stops southward _fn_ from operating.
- `I`, **increment**: Increments southward numeric _fn_ on **bang**.
- `J`, **jump**: Moves the westward _fn_ to eastward, or the eastward _fn_ westward, on **bang**.
- `K`, **kill**: Kills southward _fns_, on **bang**.
- `L`, **left**: Moves westward.
- `M`, **modulo**: Creates the result of the modulo operation of east and west _fns_, southward.
- `N`, **north**: Moves Northward, or bangs.
- `O`, **odd**: Transforms into `Q` when a _fn_ is present northward.
- `P`, **push**: Moves away, on **bang**.
- `Q`, **even**: Transforms into `O`, when a _fn_ is present northward, and **bangs** southward.
- `R`, **right**: Moves eastward.
- `S`, **south**: Moves southward, or bangs.
- `T`, **trigger**: Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` westward.
- `U`, **up**: Moves Northward.
- `V`, **value**: Creates a numerical value between 0 and 5 based on the number of present _fns_ westward.
- `W`, **west**: Moves westward, or bangs.
- `X`, **split**: Bangs eastward when westward _fn_ is `0`, and southward when _fn_ is `1`.
- `Y`, **automata**: Compares the type(num/alpha) of westward and eastward _fns_, and return `1` or `0` southward.
- `Z`, **creep**: Moves to a the next available location in a cycle of `R`,`D`,`L`,`U` based on the *runtime frame*.

### special functions
- `.`, **null**: Missing docs.
- `:`, **null**: Missing docs.
- `-`, **wire-h**: Missing docs.
- `|`, **wire-v**: Missing docs.
- `*`, **wire-n**: Missing docs.

## Logic Functions

The logic functions are passive, and they are `a`, `f`, `m`, `y`.

## CLI

```
node cli examples/benchmark.pico
```

## Headless

```
node pico.js ~/Desktop/hello_world.pico
```

## Install

```
cd desktop
npm install
npm start
```

## TODO

The idea is to build a synth/mini sequencer, here's some tasks I need to tackle before then.

[ ] custom synth functions, like `:SYN[ADSR](C)`
[ ] sub programs scope

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
