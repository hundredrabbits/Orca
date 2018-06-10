# Pico

Not much is known about the machine, but it seems to be reacting to our presence.

## Programs

### Add `A` [passive]
This function expects 2 numerical values, adds them up to generate an index, and create the function corresponding to this index.

### Bang `B`
The **bang** function is used to trigger various functions, only lasts one cycle.

### Clone `C` [bang]
Clones the westward function, eastwardly, on **bang**.

### Down `D` 
Moves southward.

### Explode `E` [bang]
Fires bangs in nearby available cells, on **bang**.

### If `F` [bang]
This function expects 2 functions, if the functions corresponds, F bangs southward. Erases function westward on **bang**..

### Generator `G` [bang]
Generates a `D` on **bang**.

### Halt `H` [passive]
Stops southward function from operating.

### Increment `I` [bang]
Increments southward numeric function on **bang**.

### Jump `J` [bang]
Moves the westward program to eastward, on **bang**.

### Kill `K` [bang]
Kills all nearby functions, on **bang**.

### Left `L`
Moves westward.

### Modulo `M`
Creates the result of the modulo operation of east and west values southward.

### Turn `N` [passive]
Creates a numerical function southward, based on the *runtime frame*.

### Odd `O` [passive]
Transforms into `Q` when a function is present northward.

### Push `P` [bang]
Is moved away, on **bang**.

### Even `Q` [passive]
Transforms into `O`, and **bangs** southward, when a function is present northward.

### Right `R` [passive]
Moves eastward.

### Shift `S` [passive]
Converts neighbooring functions to directions.

### Trigger `T` [passive]
Bangs southward in the presence of `1`, `U`, `R`, `D` or `L` functions northward.

### Up `U` [passive]
Moves Northward.

### Value `V` [passive]
Creates a numerical value between 0 and 5 based on the number of present functions westward.

### Warp `W` [bang]
Warps northward function to the next available warp, and halts it, on **bang**.

### Split `X` [passive]
Bangs eastward on a westward `0`, and bangs southward on `1`.

### Automata `Y` [passive]
Game of life-like automation.

### Creep `Z` [passive]
Moves to a the next available location in a cycle of `U`,`D`,`L`,`R` based on the *runtime frame*.

