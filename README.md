# Pico

[Not much is known](http://wiki.xxiivv.com/Pico) about the machine, but it seems to be reacting to our presence.

<img src='https://raw.githubusercontent.com/hundredrabbits/Pico/master/PREVIEW.jpg' width="600"/>

## Programs

- `A` **Add**[passive]: This function expects 2 numerical values, adds them up to generate an index, and create the function corresponding to this index.
- `B` **Bang**: The **bang** function is used to trigger various functions, only lasts one cycle.
- `C` **Clone**[bang]: Clones the westward function, eastwardly, on **bang**.
- `D` **Down**: Moves southward.
- `E` **Explode**[bang]: Fires bangs in nearby available cells, on **bang**.
- `F` **If**[bang]: This function expects 2 functions, if the functions corresponds, F bangs southward. Erases function westward on **bang**..
- `G` **Generator**[bang]: Generates a `D` on **bang**.
- `H` **Halt**[passive]: Stops southward function from operating.
- `I` **Increment**[bang]: Increments southward numeric function on **bang**.
- `J` **Jump**[bang]: Moves the westward program to eastward, on **bang**.
- `K` **Kill**[bang]: Kills all nearby functions, on **bang**.
- `L` **Left**: Moves westward.
- `M` **Modulo**: Creates the result of the modulo operation of east and west values southward.
- `N` **Turn**[passive]: Creates a numerical function southward, based on the *runtime frame*.
- `O` **Odd**[passive]: Transforms into `Q` when a function is present northward.
- `P` **Push**[bang]: Is moved away, on **bang**.
- `Q` **Even**[passive]: Transforms into `O`, and **bangs** southward, when a function is present northward.
- `R` **Right**[passive]: Moves eastward.
- `S` **Shift**[passive]: Converts neighbooring functions to directions.
- `T` **Trigger**[passive]: Bangs southward in the presence of `1`, `U`, `R`, `D` or `L` functions northward.
- `U` **Up**[passive]: Moves Northward.
- `V` **Value**[passive]: Creates a numerical value between 0 and 5 based on the number of present functions westward.
- `W` **Warp**[bang]: Warps northward function to the next available warp, and halts it, on **bang**.
- `X` **Split**[passive]: Bangs eastward on a westward `0`, and bangs southward on `1`.
- `Y` **Automata**[passive]: Game of life-like automation.
- `Z` **Creep**[passive]: Moves to a the next available location in a cycle of `U`,`D`,`L`,`R` based on the *runtime frame*.

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
