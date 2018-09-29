# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Programs

- `A` **Add**: Creates the result of the addition of east and west _fns_, southward.
- `B` **Bang**: The **bang** is used to trigger various _fns_, only lasts one cycle.
- `C` **Clone**(bang): Clones the westward _fn__, eastwardly, on **bang**.
- `D` **Down**: Moves southward.
- `E` **Explode**(bang): Fires bangs in neighboring available cells, on **bang**.
- `F` **If**: Bangs if east and west _fns_ are equal, southward.
- `G` **Generator**(bang): Generates a `D` on **bang**.
- `H` **Halt**: Stops southward _fn_ from operating.
- `I` **Increment**(bang): Increments southward numeric _fn_ on **bang**.
- `J` **Jump**(bang): Moves the westward _fn_ to eastward, or the eastward _fn_ westward, on **bang**.
- `K` **Kill**(bang): Kills southward _fns_, on **bang**.
- `L` **Left**: Moves westward.
- `M` **Modulo**: Creates the result of the modulo operation of east and west _fns_, southward.
- `N` **Turn**: Creates a numerical _fn_ southward, based on the *runtime frame*.
- `O` **Odd**(bang): Transforms into `Q` when a _fn_ is present northward.
- `P` **Push**(bang): Moves away, on **bang**.
- `Q` **Even**(bang): Transforms into `O`, when a _fn_ is present northward, and **bangs** southward.
- `R` **Right**: Moves eastward.
- `S` **Shift**: Converts neighboors into directions _fns_.
- `T` **Trigger**: Bangs southward in the presence of `1`, `U`, `R`, `D`, `L` or `Z` westward.
- `U` **Up**: Moves Northward.
- `V` **Value**: Creates a numerical value between 0 and 5 based on the number of present _fns_ westward.
- `W` **Warp**(bang): Warps northward _fn_ to the next available warp, and halts it, on **bang**.
- `X` **Split**: Bangs eastward when westward _fn_ is `0`, and southward when _fn_ is `1`.
- `Y` **Type**: Compares the type(num/alpha) of westward and eastward _fns_, and return `1` or `0` southward.
- `Z` **Creep**: Moves to a the next available location in a cycle of `R`,`D`,`L`,`U` based on the *runtime frame*.

## Logic Functions

The logic functions are passive, and they are `a`, `f`, `m`, `y`.

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
