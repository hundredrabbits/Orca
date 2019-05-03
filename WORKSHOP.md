# Workshop

This workshop is designed to go over the most commonly used patterns in composition with Orca. If you are using [Pilot](http://github.com/hundredrabbits/Pilot) as a sound source, remember to use the UDP operator `;` instead of `:`.

- **Part 1**: [Basics](#Basics) `D`, `R`, `T`, `C`
- **Part 2**: [Projectors](#Projectors) `E`, `X`, `B`, `I`
- **Part 3**: [Logic](#Logic) `A`, `I`, `F`, `M`
- **Part 4**: [Estate](#Estate) `V`, `K`, `J`, `Y`

## Basics

### Send a midi note

- `D8`, will send a bang every **8th frame**.
- `:03C`, will send the `C3` midi note.

```
D8...
.:03C
```

### Play a random note

- `aRG`, will output a random value between `a` & `g`, the rightside uppercase letter indicates an **uppercase output**.

```
D8.aRG.
.:03D..
```

### Make a melody

- `14TCAFE`, set a track of **4 notes**.

```
D814TCAFE
.:03A....
```

### Play the melody

- `8C4`, will count to `4`, every **8th frame**.

```
.8C4.....
D804TCAFE
.:03C....
```

## Projectors

### Send a bang

- `E`, will travel **eastward**.

### Write an X projector

- `XE`, will create a `E`, every **2nd frame**.

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

- `2I8`, will increment to `8`, at a rate of `2`, **every frame**.

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

## Logic

### Play a note with value offset, via A

- `1AC`, or `(add 1 12)`.

```
D8.1AC.
.;03D..
```

### Play a note with time offset, via F

- `.I4`, will increment to 4.
- `F2`, will bang if leftside input is equal to `2`.

```
I4.....
3F2.1AC
..;03D.
```

## Estate

### Write a variable

- `aV5`, will store `5` in the variable `a`.

```
aV5
```

### Read a variable

- `Va`, will output the value of the variable `a`.

```
.Va
.5.
```

### Read 2 variables

- `2Kab`, will output the values of `a` & `b`, side-by-side.

```
aV5.bV7
.......
2Kab...
..57...
```

### Use 3 variables

- `3Kion`, will output the values of `i`, `o` & `n`, side-by-side.

```
iV0.oV3.nVC
...........
3Kion......
.:03C......
```

### Carry a bang

- `Y`, will output the leftside input, eastwardly.

```
D43Kion...
.Y.:03C...
```