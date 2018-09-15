# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Programs

### Moves

- `D` **Down**: Moves southward.
- `L` **Left**: Moves westward.
- `R` **Right**: Moves eastward.
- `U` **Up**: Moves Northward.
- `S` **Shift**: Converts neighboors into directions.

### Logic

- `A` **Add**: Creates the result of the addition of east and west _fns_, southward.
- `F` **If**: Bangs if east and west _fns_ are equal, southward.
- `M` **Modulo**: Creates the result of the modulo operation of east and west _fns_, southward.
- `X` **Split**: Bangs eastward when westward _fn_ is `0`, and southward when _fn_ is `1`.
- `T` **Trigger**: Bangs southward in the presence of `1`, `U`, `R`, `D`, `L` or `Z` westward.

### Filters

- `J` **Jump**(bang): Moves the westward _fn_ to eastward, or the eastward _fn_ westward, on **bang**.
- `C` **Clone**(bang): Clones the westward _fn__fn_, eastwardly, on **bang**.

### Directors

- `G` **Generator**(bang): Generates a `D` on **bang**.
- `I` **Increment**(bang): Increments southward numeric _fn_ on **bang**.
- `K` **Kill**(bang): Kills southward _fns_, on **bang**.
- `O` **Odd**(bang): Transforms into `Q` when a _fn_ is present northward.
- `Q` **Even**(bang): Transforms into `O`, and **bangs** southward, when a _fn_ is present northward.

### Automated

- `B` **Bang**: The **bang** _fn_ is used to trigger various _fns_, only lasts one cycle.
- `H` **Halt**: Stops southward _fn_ from operating.
- `N` **Turn**(passive): Creates a numerical _fn_ southward, based on the *runtime frame*.
- `Y` **Automata**(passive): Game of life-like automation.
- `Z` **Creep**(passive): Moves to a the next available location in a cycle of `R`,`D`,`L`,`U` based on the *runtime frame*.

### Special

- `E` **Explode**(bang): Fires bangs in nearby available cells, on **bang**.
- `P` **Push**(bang): Is moved away, on **bang**.
- `V` **Value**: Creates a numerical value between 0 and 5 based on the number of present _fns_ westward.
- `W` **Warp**(bang): Warps northward _fn_ to the next available warp, and halts it, on **bang**.

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

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
