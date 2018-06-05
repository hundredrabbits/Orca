# Pico

Not much is known about the machine, but it seems to be reacting to our presence.

## Programs

### Add `A`
This function expects 2 numerical values, adds them up to generate an index, and create the letter function corresponding to this index, on **bang**.

### Bang `B`
The **bang** function is used to trigger various functions, only lasts one cycle.

### Chain `C`
Fires bangs in nearby available cells, on **bang**.

### Down `D`
Moves southward.

### Explode `E`
When a cell is nearby, it creates 4 new cells of that type, and is destroyed, on **bang**.

### If `F`
This function expects 2 functions, if the functions corresponds, F bangs southward.

### Generator `G`
Generates a `D` on **bang**.

### Halt `H`
Stops southward function from operating.

### Increment `I`
Increments southward numeric function on **bang**.

### Jump `J`
Moves the westward program to eastward, on **bang**.

### Kill `K`
Kills all nearby functions, on **bang**.

### Left `L`
Moves westward.

### Modulo `M`
Creates the result of the modulo operation of east and west values, soutward on **bang**.

### Turn `N`
Creates a numerical function southward, the value is a fraction of the current frame number.

### Odd `O`
Transforms into `Q` when a function is present northward.

### Push `P`
Is moved away, on **bang**.

### Even `Q`
Transforms into `O`, and **bangs** southward, when a function is present northward.

### Right `R`
Moves eastward.

### Shift `S`
Shifts the `U`, `R`, `D`, `L` functions.

### Trigger `T`
Bangs southward in the presence of `1`, `U`, `R`, `D` or `L` functions northward.

### Up `U`
Moves Northward.

### Value `V`
Creates a numerical value between 0 and 5 based on the number of present functions westward.

### Warp `W`
Warps northward function to the next available warp, on **bang**.

### Split `X`
Bangs eastward on a westward `0`, and bangs southward on `1`.

### Automata `Y`
Game of life-like automation.

### Creep `Z`
Moves to a random available cell.

