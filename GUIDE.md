# Guide

Orca is **not a synth**, but a [livecoding environment](https://www.reddit.com/r/livecoding/) to write procedural sequencers. In other words, **Orca is meant to control other applications** such as a DAW(Ableton, Renoise, VCV Rack, etc.), or an audio server such as SuperCollider.

To open the console, press `ctrl+.`.

## Midi

### List Midi Devices

In console, type `terminal.io.midi.list()` to see the list of available midi devices.

### Select Midi Device

In console, type `terminal.io.midi.select(1)` to select the second midi device.

## UDP

### Select UDP Port

In console, type `terminal.io.udp.select(49160)` to select the **49160** udp port.

## OSC

### Select OSC Port

In console, type `terminal.io.osc.select(49162)` to select the **49162** osc port.
