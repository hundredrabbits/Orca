'use strict'

/* global Operator */
/* global client */

const library = {}

library.a = function OperatorA (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'a', passive)

  this.name = 'add'
  this.info = 'Outputs sum of inputs'

  this.ports.a = { x: -1, y: 0 }
  this.ports.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const a = this.listen(this.ports.a, true)
    const b = this.listen(this.ports.b, true)
    return orca.keyOf(a + b)
  }
}

library.b = function OperatorL (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'b', passive)

  this.name = 'bounce'
  this.info = 'Outputs difference between inputs'

  this.ports.a = { x: -1, y: 0 }
  this.ports.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const a = this.listen(this.ports.a, true)
    const b = this.listen(this.ports.b, true)
    return orca.keyOf(Math.abs(b - a))
  }
}

library.c = function OperatorC (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Outputs modulo of frame'

  this.ports.rate = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.mod = { x: 1, y: 0, default: '8' }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.rate, true)
    const mod = this.listen(this.ports.mod, true)
    const val = Math.floor(orca.f / rate) % mod
    return orca.keyOf(val)
  }
}

library.d = function OperatorD (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'd', passive)

  this.name = 'delay'
  this.info = 'Bangs on modulo of frame'

  this.ports.rate = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.mod = { x: 1, y: 0, default: '8' }
  this.ports.output = { x: 0, y: 1, bang: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.rate, true)
    const mod = this.listen(this.ports.mod, true)
    const res = orca.f % (mod * rate)
    return res === 0 || mod === 1
  }
}

library.e = function OperatorE (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'e', passive)

  this.name = 'east'
  this.info = 'Moves eastward, or bangs'
  this.draw = false

  this.operation = function () {
    this.move(1, 0)
    this.passive = false
  }
}

library.f = function OperatorF (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'f', passive)

  this.name = 'if'
  this.info = 'Bangs if inputs are equal'

  this.ports.a = { x: -1, y: 0 }
  this.ports.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, bang: true }

  this.operation = function (force = false) {
    const a = this.listen(this.ports.a)
    const b = this.listen(this.ports.b)
    return a === b
  }
}

library.g = function OperatorG (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Writes operands with offset'

  this.ports.x = { x: -3, y: 0 }
  this.ports.y = { x: -2, y: 0 }
  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    const x = this.listen(this.ports.x, true)
    const y = this.listen(this.ports.y, true) + 1
    for (let offset = 0; offset < len; offset++) {
      const inPort = { x: offset + 1, y: 0 }
      const outPort = { x: x + offset, y: y, output: true }
      this.addPort(`in${offset}`, inPort)
      this.addPort(`out${offset}`, outPort)
      const res = this.listen(inPort)
      this.output(`${res}`, outPort)
    }
  }
}

library.h = function OperatorH (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Halts southward operand'

  this.ports.output = { x: 0, y: 1, reader: true }

  this.operation = function (force = false) {
    orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y)
    return this.listen(this.ports.output, true)
  }
}

library.i = function OperatorI (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward operand'

  this.ports.step = { x: -1, y: 0, default: '1' }
  this.ports.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true, reader: true }

  this.operation = function (force = false) {
    const step = this.listen(this.ports.step, true)
    const mod = this.listen(this.ports.mod, true)
    const val = this.listen(this.ports.output, true)
    return orca.keyOf((val + step) % (mod > 0 ? mod : 36))
  }
}

library.j = function OperatorJ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'j', passive)

  this.name = 'jumper'
  this.info = 'Outputs northward operand'

  this.ports.val = { x: 0, y: -1 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    orca.lock(this.x, this.y + 1)
    return this.listen(this.ports.val)
  }
}

library.k = function OperatorK (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'k', passive)

  this.name = 'konkat'
  this.info = 'Reads multiple variables'

  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }

  this.operation = function (force = false) {
    this.len = this.listen(this.ports.len, true)
    for (let offset = 0; offset < this.len; offset++) {
      const key = orca.glyphAt(this.x + offset + 1, this.y)
      orca.lock(this.x + offset + 1, this.y)
      if (key === '.') { continue }
      const inPort = { x: offset + 1, y: 0 }
      const outPort = { x: offset + 1, y: 1, output: true }
      this.addPort(`in${offset}`, inPort)
      this.addPort(`out${offset}`, outPort)
      const res = orca.valueIn(key)
      this.output(`${res}`, outPort)
    }
  }
}

library.l = function OperatorL (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'l', passive)

  this.name = 'lesser'
  this.info = 'Outputs smallest input'

  this.ports.a = { x: -1, y: 0 }
  this.ports.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const a = this.listen(this.ports.a)
    const b = this.listen(this.ports.b)
    return a !== '.' && b !== '.' ? orca.keyOf(Math.min(orca.valueOf(a), orca.valueOf(b))) : '.'
  }
}

library.m = function OperatorM (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'm', passive)

  this.name = 'multiply'
  this.info = 'Outputs product of inputs'

  this.ports.a = { x: -1, y: 0 }
  this.ports.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const a = this.listen(this.ports.a, true)
    const b = this.listen(this.ports.b, true)
    return orca.keyOf(a * b)
  }
}

library.n = function OperatorN (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'n', passive)

  this.name = 'north'
  this.info = 'Moves Northward, or bangs'
  this.draw = false

  this.operation = function () {
    this.move(0, -1)
    this.passive = false
  }
}

library.o = function OperatorO (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'o', passive)

  this.name = 'read'
  this.info = 'Reads operand with offset'

  this.ports.x = { x: -2, y: 0 }
  this.ports.y = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    const x = this.listen(this.ports.x, true)
    const y = this.listen(this.ports.y, true)
    this.addPort('read', { x: x + 1, y: y })
    return this.listen(this.ports.read)
  }
}

library.p = function OperatorP (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'p', passive)

  this.name = 'push'
  this.info = 'Writes eastward operand'

  this.ports.key = { x: -2, y: 0 }
  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.val = { x: 1, y: 0 }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    const key = this.listen(this.ports.key, true)
    for (let offset = 0; offset < len; offset++) {
      orca.lock(this.x + offset, this.y + 1)
    }
    this.ports.output = { x: (key % len), y: 1 }
    return this.listen(this.ports.val)
  }
}

library.q = function OperatorQ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'q', passive)

  this.name = 'query'
  this.info = 'Reads operands with offset'

  this.ports.x = { x: -3, y: 0 }
  this.ports.y = { x: -2, y: 0 }
  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    const x = this.listen(this.ports.x, true)
    const y = this.listen(this.ports.y, true)
    for (let offset = 0; offset < len; offset++) {
      const inPort = { x: x + offset + 1, y: y }
      const outPort = { x: offset - len + 1, y: 1, output: true }
      this.addPort(`in${offset}`, inPort)
      this.addPort(`out${offset}`, outPort)
      const res = this.listen(inPort)
      this.output(`${res}`, outPort)
    }
  }
}

library.r = function OperatorR (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'r', passive)

  this.name = 'random'
  this.info = 'Outputs random value'

  this.ports.min = { x: -1, y: 0 }
  this.ports.max = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const min = this.listen(this.ports.min, true)
    const max = this.listen(this.ports.max, true)
    const val = parseInt((Math.random() * ((max > 0 ? max : 36) - min)) + min)
    return orca.keyOf(val)
  }
}

library.s = function OperatorS (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 's', passive)

  this.name = 'south'
  this.info = 'Moves southward, or bangs'
  this.draw = false

  this.operation = function () {
    this.move(0, 1)
    this.passive = false
  }
}

library.t = function OperatorT (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 't', passive)

  this.name = 'track'
  this.info = 'Reads eastward operand'

  this.ports.key = { x: -2, y: 0 }
  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    const key = this.listen(this.ports.key, true)
    for (let offset = 0; offset < len; offset++) {
      orca.lock(this.x + offset + 1, this.y)
    }
    this.ports.val = { x: (key % len) + 1, y: 0 }
    return this.listen(this.ports.val)
  }
}

library.u = function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'uclid'
  this.info = 'Bangs on Euclidean rhythm'

  this.ports.step = { x: -1, y: 0, clamp: { min: 0 }, default: '1' }
  this.ports.max = { x: 1, y: 0, clamp: { min: 1 }, default: '8' }
  this.ports.output = { x: 0, y: 1, bang: true }

  this.operation = function (force = false) {
    const step = this.listen(this.ports.step, true)
    const max = this.listen(this.ports.max, true)
    const bucket = (step * (orca.f + max - 1)) % max + step
    return bucket >= max
  }
}

library.v = function OperatorV (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'v', passive)

  this.name = 'variable'
  this.info = 'Reads and writes variable'

  this.ports.write = { x: -1, y: 0 }
  this.ports.read = { x: 1, y: 0 }

  this.operation = function (force = false) {
    const write = this.listen(this.ports.write)
    const read = this.listen(this.ports.read)
    if (write === '.' && read !== '.') {
      this.addPort('output', { x: 0, y: 1 })
    }
    if (write !== '.') {
      orca.variables[write] = read
      return
    }
    return orca.valueIn(read)
  }
}

library.w = function OperatorW (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'w', passive)

  this.name = 'west'
  this.info = 'Moves westward, or bangs'
  this.draw = false

  this.operation = function () {
    this.move(-1, 0)
    this.passive = false
  }
}

library.x = function OperatorX (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'x', passive)

  this.name = 'write'
  this.info = 'Writes operand with offset'

  this.ports.x = { x: -2, y: 0 }
  this.ports.y = { x: -1, y: 0 }
  this.ports.val = { x: 1, y: 0 }

  this.operation = function (force = false) {
    const x = this.listen(this.ports.x, true)
    const y = this.listen(this.ports.y, true) + 1
    this.addPort('output', { x: x, y: y })
    return this.listen(this.ports.val)
  }
}

library.y = function OperatorY (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'y', passive)

  this.name = 'jymper'
  this.info = 'Outputs westward operand'

  this.ports.val = { x: -1, y: 0 }
  this.ports.output = { x: 1, y: 0 }

  this.operation = function (force = false) {
    orca.lock(this.x + 1, this.y)
    return this.listen(this.ports.val)
  }
}

library.z = function OperatorZ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'z', passive)

  this.name = 'lerp'
  this.info = 'Transitions operand to target'

  this.ports.rate = { x: -1, y: 0, default: '1' }
  this.ports.target = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true, reader: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.rate, true)
    const target = this.listen(this.ports.target, true)
    const val = this.listen(this.ports.output, true)
    const mod = val <= target - rate ? rate : val >= target + rate ? -rate : target - val
    return orca.keyOf(val + mod)
  }
}

// Specials

library['*'] = function OperatorBang (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '*', true)

  this.name = 'bang'
  this.info = 'Bangs neighboring operands'
  this.draw = false

  this.run = function (force = false) {
    this.draw = false
    this.erase()
  }
}

library['#'] = function OperatorComment (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '#', true)

  this.name = 'comment'
  this.info = 'Halts line'
  this.draw = false

  this.operation = function () {
    for (let x = this.x + 1; x <= orca.w; x++) {
      orca.lock(x, this.y)
      if (orca.glyphAt(x, this.y) === this.glyph) { break }
    }
    orca.lock(this.x, this.y)
  }
}

// IO

library.$ = function OperatorSelf (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '*', true)

  this.name = 'self'
  this.info = 'Sends ORCA command'

  this.run = function (force = false) {
    let msg = ''
    for (let x = 1; x <= 36; x++) {
      const g = orca.glyphAt(this.x + x, this.y)
      orca.lock(this.x + x, this.y)
      if (g === '.') { break }
      msg += g
    }

    if (!this.hasNeighbor('*') && force === false) { return }
    if (msg === '') { return }

    this.draw = false
    client.commander.trigger(`${msg}`, { x, y: y + 1 })
  }
}

library[':'] = function OperatorMidi (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends MIDI note'
  this.ports.channel = { x: 1, y: 0 }
  this.ports.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } }
  this.ports.note = { x: 3, y: 0 }
  this.ports.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
  this.ports.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 32 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.octave) === '.') { return }
    if (this.listen(this.ports.note) === '.') { return }
    if (!isNaN(this.listen(this.ports.note))) { return }

    const channel = this.listen(this.ports.channel, true)
    if (channel > 15) { return }
    const octave = this.listen(this.ports.octave, true)
    const note = this.listen(this.ports.note)
    const velocity = this.listen(this.ports.velocity, true)
    const length = this.listen(this.ports.length, true)

    client.io.midi.push(channel, octave, note, velocity, length)

    if (force === true) {
      client.io.midi.run()
    }

    this.draw = false
  }
}

library['!'] = function OperatorCC (orca, x, y) {
  Operator.call(this, orca, x, y, '!', true)

  this.name = 'cc'
  this.info = 'Sends MIDI control change'
  this.ports.channel = { x: 1, y: 0 }
  this.ports.knob = { x: 2, y: 0, clamp: { min: 0 } }
  this.ports.value = { x: 3, y: 0, clamp: { min: 0 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.knob) === '.') { return }

    const channel = this.listen(this.ports.channel, true)
    if (channel > 15) { return }
    const knob = this.listen(this.ports.knob, true)
    const rawValue = this.listen(this.ports.value, true)
    const value = Math.ceil((127 * rawValue) / 35)

    client.io.cc.stack.push({ channel, knob, value, type: 'cc' })

    this.draw = false

    if (force === true) {
      client.io.cc.run()
    }
  }
}

library['?'] = function OperatorPB (orca, x, y) {
  Operator.call(this, orca, x, y, '?', true)

  this.name = 'pb'
  this.info = 'Sends MIDI pitch bend'
  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 15 } }
  this.ports.lsb = { x: 2, y: 0, clamp: { min: 0 } }
  this.ports.msb = { x: 3, y: 0, clamp: { min: 0 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.lsb) === '.') { return }

    const channel = this.listen(this.ports.channel, true)
    const rawlsb = this.listen(this.ports.lsb, true)
    const lsb = Math.ceil((127 * rawlsb) / 35)
    const rawmsb = this.listen(this.ports.msb, true)
    const msb = Math.ceil((127 * rawmsb) / 35)

    client.io.cc.stack.push({ channel, lsb, msb, type: 'pb' })

    this.draw = false

    if (force === true) {
      client.io.cc.run()
    }
  }
}

library['%'] = function OperatorMono (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '%', true)

  this.name = 'mono'
  this.info = 'Sends MIDI monophonic note'
  this.ports.channel = { x: 1, y: 0 }
  this.ports.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } }
  this.ports.note = { x: 3, y: 0 }
  this.ports.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
  this.ports.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 32 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.octave) === '.') { return }
    if (this.listen(this.ports.note) === '.') { return }
    if (!isNaN(this.listen(this.ports.note))) { return }

    const channel = this.listen(this.ports.channel, true)
    if (channel > 15) { return }
    const octave = this.listen(this.ports.octave, true)
    const note = this.listen(this.ports.note)
    const velocity = this.listen(this.ports.velocity, true)
    const length = this.listen(this.ports.length, true)

    client.io.mono.push(channel, octave, note, velocity, length)

    if (force === true) {
      client.io.mono.run()
    }

    this.draw = false
  }
}

library['='] = function OperatorOsc (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '=', true)

  this.name = 'osc'
  this.info = 'Sends OSC message'

  this.ports.path = { x: 1, y: 0 }

  this.operation = function (force = false) {
    let msg = ''
    for (let x = 2; x <= 36; x++) {
      const g = orca.glyphAt(this.x + x, this.y)
      orca.lock(this.x + x, this.y)
      if (g === '.') { break }
      msg += g
    }

    if (!this.hasNeighbor('*') && force === false) { return }
    if (msg === '') { return }

    const path = this.listen(this.ports.path)

    if (!path || path === '.') { return }

    this.draw = false
    client.io.osc.push('/' + path, msg)

    if (force === true) {
      client.io.osc.run()
    }
  }
}

library[';'] = function OperatorUdp (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ';', true)

  this.name = 'udp'
  this.info = 'Sends UDP message'

  this.operation = function (force = false) {
    let msg = ''
    for (let x = 1; x <= 36; x++) {
      const g = orca.glyphAt(this.x + x, this.y)
      orca.lock(this.x + x, this.y)
      if (g === '.') { break }
      msg += g
    }

    if (!this.hasNeighbor('*') && force === false) { return }
    if (msg === '') { return }

    this.draw = false
    client.io.udp.push(msg)

    if (force === true) {
      client.io.udp.run()
    }
  }
}

// Add numbers

for (let i = 0; i <= 9; i++) {
  library[`${i}`] = function OperatorNull (orca, x, y, passive) {
    Operator.call(this, orca, x, y, '.', false)

    this.name = 'null'
    this.info = 'empty'

    // Overwrite run, to disable draw.
    this.run = function (force = false) {

    }
  }
}
