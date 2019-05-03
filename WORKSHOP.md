# Workshop

This workshop is designed to go over the most commonly used patterns in composition with Orca. If you are using [Pilot](http://github.com/hundredrabbits/Pilot) as a sound source, remember to use the UDP operator `;` instead of `:`.

- **Part 1: Basics**: `D`, `R`, `T`, `C`
- **Part 2: Projectors**: `E`, `X`, `B`, `I`
- **Part 3: Logic**: `A`, `I`, `F`, `M`
- **Part 4: Estate**: `V`, `K`, `J`, `Y`

## Part 1: Basics

### Send a midi note

- `D8`, will send a bang every 8th frame.
- `:03C`, will send the `C3` midi note.

```
D8...
.:03C
```

### Play a random note

- `aRG`, will output a random value between `a-g`, the right-side uppercase letter indicates an uppercase output.

```
D8.aRG.
.:03D..
```

### Make a melody

- `14TCAFE`, set a track of 4 notes.

```
D814TCAFE
.:03A....
```

### Play the melody

- `8C4`, will count to `4`, every 8th frame.

```
.8C4.....
D804TCAFE
.:03C....
```

## Part 2: Projectors

### Send a bang

- `E`, will send a `E` eastward.

### Write an X projector

- `XE`, will create a `E` every second frame.

```
..XE
```

### Animate the projector, with B

- `B8`, will bounce between `0` and `8`.

```
B8.
5XE
```

### Animate the projector, with I

- `2I8`, will increment to `8`, at a rate of `2` each frame.

```
7I8.
.5XE
```

### Add notes on the paths of the Es

```
7I8...................
.5XE..................
.....E.......E....;03C
......E.......E...;03D
.......E.......E..;03E
........E.......E.;03F
.........E.......E;03G
..E.......E......*;03A
...E.......E......;03B
....E.......E.....;03C
```

## Part 3: Logic

### Play a note with value offset, via A

- `1AC`

```
D8.1AC.
.;03D..
```

### Play a note with time offset, via F

- `I4` and `F2`

```
I4.....
3F2.1AC
..;03D.
```

### Store values in variables

```
.I4.......
.1F2.1AC..
aV..bVD...
..........
.Va..Vb...
..;03D....
```

## Part 4: Estate

### Write a variable

- `aV5`

```
aV5
```

### Read a variable

- `Va`

```
.Va
.5.
```

### Read 2 variables

- `2Kab`

```
aV5.bV7
.......
2Kab...
..57...
```

### Use 2 variables

- `3Kion`

```
iV0.oV3.nVC
...........
3Kion......
.:03C......
```

### Carry a bang

- `Y`

```
D43Kion...
.Y.:03C...
```