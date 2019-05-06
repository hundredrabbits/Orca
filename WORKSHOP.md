# Workshop

This workshop is designed to go over the **most commonly used patterns in composition** with [Orca](https://github.com/hundredrabbits/Orca). If you are using [Pilot](http://github.com/hundredrabbits/Pilot) as a sound source, remember to use the UDP operator `;` instead of the MIDI operator `:`.

We recommend to distribute a printed copy of the [list of operators](https://github.com/hundredrabbits/Orca#operators), so students can do their own experiments.

- **Part 1**: [Basics](#Basics) `D`, `R`, `T`, `C`
- **Part 2**: [Logic](#Logic) `I`, `A`, `F`, `B`
- **Part 3**: [Projectors](#Projectors) `E`, `H`, `X`, `O`,
- **Part 4**: [Variables](#Variables) `V`, `K`, `J`, `Y`

## Basics

This section will teach the basics of playing a note and a sequence of notes.

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

- `8C4`, will count from `0` to `3`, at **1/8th speed**.

```
.8C4.....
D804TCAFE
.:03C....
```

## Logic

This section will teach the basics of automating logic decisions and changing the values of operators dynamically.

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
..2B8..
D2.5AC.
.:03H..
```

### Play a note at a specific interval

- `.I4`, will increment to `4`, at a rate of `1`.
- `.F2`, will bang only if leftside input is equal to `2`.

```
I4.....
3F2.1AC
..:03D.
```

## Projectors

This section will teach the basics of creating new operators procedurally.

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
B4..........
1XE.........
........:03C
........:03D
........:03E
........:03F
```

## Variables

This section will teach the basics of storing accessing and combining that stored data.

### Write a variable

- `aV5`, will store `5` in the variable `a`.

```
aV5
```

### Read a variable

- `Va`, will output the value of the variable `a`. Notice how variables always **have to be written above where they are read**.

```
.....Va
.......
aV5..Va
.....5.
.......
aV6..Va
.....6.
```

### Read 3 variables

- `3Kion`, will output the values of `i`, `o` & `n`, side-by-side.

```
iV0.oV3.nVC
...........
3Kion......
.:03C......
```

### Carry a value horizontally and vertically

- `Y`, will output the west input, eastward.
- `J`, will output the north input, southward.

```
3..
J..
3Y3
```

### Carry a bang

- This method will allow you to bring bangs into tight spots.

```
D43Ka...
.Y.:03C...
```

I hope this workshop has been enlightening, if you have questions or suggestions, please visit the [forum](https://llllllll.co/t/orca-live-coding-tool/17689), or the [chatroom](https://talk.lurk.org/channel/orca). Enjoy!

