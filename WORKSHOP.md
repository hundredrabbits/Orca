# Workshop

This workshop is designed to go over the **most commonly used patterns in composition** with [Orca](https://github.com/hundredrabbits/Orca). If you are using [Pilot](http://github.com/hundredrabbits/Pilot) as a sound source, remember to use the UDP operator `;` instead of the MIDI operator `:`. 

We recommend to distribute a printed copy of the [list of operators](https://github.com/hundredrabbits/Orca#operators), so students can do their own experiments.

- **Part 1**: [Basics](#Basics) `D`, `R`, `T`, `C`
- **Part 2**: [Logic](#Logic) `I`, `A`, `F`, `B`
- **Part 3**: [Projectors](#Projectors) `E`, `H`, `X`, `O`,
- **Part 4**: [Estate](#Estate) `V`, `K`, `J`, `Y`

## Basics

This section will teach the basics of assembling a pattern, and sending a note.

### Send a midi note

- `D8`, will send a bang, every **8th frame**.
- `:03C`, will send the `C` note, on the **3rd octave**, to send `C#`, use the lowercase `c3`.

```
D8...
.:03C
```

### Play a random note

- `aRG`, will output a random value between `A` & `G`, the rightside uppercase letter indicates an **uppercase output**.

```
D8.aRG.
.:03D..
```

### Make a melody

- `04TCAFE`, will create a track of **4 notes**, and output its first value.

```
D814TCAFE
.:03A....
```

### Play the melody

- `8C4`, will count from `0` to `3`, every **8th frame**.

```
.8C4.....
D804TCAFE
.:03C....
```

## Logic

### Play every second note

- `2I6`, will increment to `6` at a rate of `2`.

```
.2I6.......
D846TCAFEDG
.:03D......
```

### Play a note with an offset

- `1AC`, will add `1` to `C`, to output `D`. To get `D#`, use the lowercase `d`, like `1Ac`.

```
D8.1AC.
.:03D..
```

### Play a sequence back and forth

- `2B8`, will count from `0` to `7`, and back down to `0`, at **half speed**.
- `5AC`, will increment the value so the sequence starts at the note `C`.

```
..2B7..
D2.5AC.
.:03H..
```

### Play a note at a specific interval

- `.I4`, will increment to `4`, at a rate of `1`.
- `.F2`, will bang only if leftside input is equal to `2`.

```
I8.....
3F2.1AC
..:03D.
```

## Projectors

### Send a bang

- `E`, will travel further **eastward**, every frame.

### Halt a moving operator

- `H`, will stop a `E` from moving.

```
..H
E..
```

### Read an operator at position

- `22O`, will get the operator `E` at the offset `2,2`.

```
22O...
..E..H
.....E
```

### Write an operator at position

- `22X`, will output the operator `E` at the offset `2,2`.

```
22XE.
.....
.....
....E
```

### Animate a projector

- `B8`, will bounce between `0` and `8`.

```
B4...................
5XE..................
....E.......E....:03C
.....E.......E...:03D
......E.......E..:03E
.......E.......E.:03F
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

### Read 3 variables

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
