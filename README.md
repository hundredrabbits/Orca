# Pico

Not much is known about the machine, but it seems to be reacting to our presence.

## Programs

### Add `A`
This function expects 2 numerical values, adds them up to generate an index, and create the letter function corresponding to this index.

### Bang `B`
This function is used to trigger various functions.

### Chain `C`
When a bang is nearby, it fires bangs in nearby available cells.

### Down `D`
Moves southward.

### explode `E`
When a cell is nearby, it creates 4 new cells of that type, and is destroyed.

### if `F`
This function expects 2 functions, if the functions corresponds, F bangs southward.

### generator `G`
Generates a `D` on bang.

### halt `H`
Stops nearby functions from operating.

### increment `I`
Increments a nearby numeric function on **bang**.

### jump `J`
Moves the westward program to eastward, on **bang**.

### kill `K`
Kills all nearby functions, on **bang**.

### left `L`
Moves westward.

### modulo `M`
No details.

### turn `N`
Creates a numerical function southward, the value is a fraction of the current frame number.

### odd `O`
Transforms into `Q` when a function is present northward.

### push `P`
Is moved away, on **bang**.

### even `Q`
Transforms into `O`, and **bangs** southward, when a function is present northward.

### right `R`
Moves eastward.

### shift `S`
Shifts the `U`, `R`, `D`, `L` functions.

### trigger `T`
Bangs southward in the presence of `1`, `U`, `R`, `D` or `L` functions northward.

### up `U`
Moves Northward.

### value `V`
Creates a numerical value between 0 and 5 based on the number of present functions westward.

### warp `W`
Warps northward function to the next available warp.

### split `X`
Bangs eastward on a westward `0`, and bangs southward on `1`.

### automata `Y`
Game of life-like automation.

### creep `Z`
Moves to a random available cell.

