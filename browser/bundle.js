var Terminal = (function () {
  'use strict';

  var transpose = {
    'A': 'A0',
    'a': 'a0',
    'B': 'B0',
    'C': 'C0',
    'c': 'c0',
    'D': 'D0',
    'd': 'd0',
    'E': 'E0',
    'F': 'F0',
    'f': 'f0',
    'G': 'G0',
    'g': 'g0',
    'H': 'A0',
    'h': 'a0',
    'I': 'B0',
    'J': 'C1',
    'j': 'c1',
    'K': 'D1',
    'k': 'd1',
    'L': 'E1',
    'M': 'F1',
    'm': 'f1',
    'N': 'G1',
    'n': 'g1',
    'O': 'A1',
    'o': 'a1',
    'P': 'B1',
    'Q': 'C2',
    'q': 'c2',
    'R': 'D2',
    'r': 'd2',
    'S': 'E2',
    'T': 'F2',
    't': 'f2',
    'U': 'G2',
    'u': 'g2',
    'V': 'A2',
    'v': 'a2',
    'W': 'B2',
    'X': 'C3',
    'x': 'c3',
    'Y': 'D3',
    'y': 'd3',
    'Z': 'E3',
    // Catch e
    'e': 'F0',
    'l': 'F1',
    's': 'F2',
    'z': 'F3',
    // Catch b
    'b': 'C0',
    'i': 'C0',
    'p': 'C1',
    'w': 'C2'
  };

  function Operator (orca, x, y, glyph = '.', passive = false) {
    this.name = 'unknown';
    this.x = x;
    this.y = y;
    this.passive = passive;
    this.draw = passive;
    this.glyph = passive ? glyph.toUpperCase() : glyph;
    this.info = '--';
    this.ports = { input: {}, haste: {}, bang: !passive };

    // Actions

    this.listen = function (port, toValue = false) {
      if (!port) { return (toValue ? 0 : '.') }
      const g = orca.glyphAt(this.x + port.x, this.y + port.y);
      const glyph = (g === '.' || g === '*') && port.default ? port.default : g;
      if (toValue) {
        const min = port.clamp && port.clamp.min ? port.clamp.min : 0;
        const max = port.clamp && port.clamp.max ? port.clamp.max : 36;
        return clamp(orca.valueOf(glyph), min, max)
      }
      return glyph
    };

    this.output = function (g) {
      if (!this.ports.output) { console.warn(this.name, 'Trying to output, but no port'); return }
      if (!g) { return }
      orca.write(this.x + this.ports.output.x, this.y + this.ports.output.y, this.requireUC() === true ? `${g}`.toUpperCase() : g);
    };

    this.bang = function (b) {
      if (!this.ports.output) { console.warn(this.name, 'Trying to bang, but no port'); return }
      orca.write(this.x + this.ports.output.x, this.y + this.ports.output.y, b === true ? '*' : '.');
    };

    // Phases

    this.permissions = function () {
      for (const id in this.ports.input) {
        const port = this.ports.input[id];
        orca.lock(this.x + port.x, this.y + port.y);
      }
      if (this.ports.output) {
        orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y);
      }
    };

    this.haste = function () {
    };

    this.operation = function () {

    };

    this.run = function (force = false) {
      this.draw = true;
      const payload = this.operation(force);
      if (this.ports.output) {
        if (this.ports.output.bang === true) {
          this.bang(payload);
        } else {
          this.output(payload);
        }
      }
    };

    // Helpers

    this.lock = function () {
      orca.lock(this.x, this.y);
    };

    this.replace = function (g) {
      orca.write(this.x, this.y, g);
    };

    this.erase = function () {
      this.replace('.');
    };

    this.explode = function () {
      this.replace('*');
      this.lock();
    };

    this.move = function (x, y) {
      const offset = { x: this.x + x, y: this.y + y };
      if (!orca.inBounds(offset.x, offset.y)) { this.explode(); return }
      const collider = orca.glyphAt(offset.x, offset.y);
      if (collider !== '*' && collider !== '.') { this.explode(); return }
      this.erase();
      this.x += x;
      this.y += y;
      this.replace(this.glyph);
      this.lock();
    };

    this.hasNeighbor = function (g) {
      if (orca.glyphAt(this.x + 1, this.y) === g) { return true }
      if (orca.glyphAt(this.x - 1, this.y) === g) { return true }
      if (orca.glyphAt(this.x, this.y + 1) === g) { return true }
      if (orca.glyphAt(this.x, this.y - 1) === g) { return true }
      return false
    };

    // Docs

    this.getPorts = function () {
      const a = [];
      if (this.draw === true) {
        a.push([this.x, this.y, 0, `${this.name.charAt(0).toUpperCase() + this.name.substring(1).toLowerCase()}`]);
      }
      if (!this.passive) { return a }
      for (const id in this.ports.haste) {
        const port = this.ports.haste[id];
        a.push([this.x + port.x, this.y + port.y, 1, `${this.glyph}-${id}`]);
      }
      for (const id in this.ports.input) {
        const port = this.ports.input[id];
        a.push([this.x + port.x, this.y + port.y, 2, `${this.glyph}-${id}`]);
      }
      if (this.ports.output) {
        const port = this.ports.output;
        a.push([this.x + port.x, this.y + port.y, 3, `${this.glyph}-output`]);
      }
      return a
    };

    this.requireUC = function (ports = this.ports.input) {
      if (this.ports.output.sensitive !== true) { return false }
      for (const id in ports) {
        const value = this.listen(ports[id]);
        if (value.length !== 1) { continue }
        if (value.toLowerCase() === value.toUpperCase()) { continue }
        if (`${value}`.toUpperCase() === `${value}`) { return true }
      }
      return false
    };

    // Notes tools

    this.transpose = function (n, o = 3) {
      if (!transpose[n]) { return { note: n, octave: o } }
      const note = transpose[n].charAt(0);
      const octave = clamp(parseInt(transpose[n].charAt(1)) + o, 0, 8);
      const value = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'].indexOf(note);
      const id = clamp((octave * 12) + value, 0, 127);
      const real = id < 89 ? Object.keys(transpose)[id - 45] : null;
      return { id, value, note, octave, real }
    };

    // Docs

    this.docs = function () {
      return `\`${this.glyph.toUpperCase()}\` **${this.name}**: ${this.info}`
    };

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var operator = Operator;

  function OperatorNull (orca, x, y, passive) {
    operator.call(this, orca, x, y, '.', false);

    this.name = 'null';
    this.info = 'empty';

    // Overwrite run, to disable draw.

    this.run = function (force = false) {

    };
  }

  var _null = OperatorNull;

  function OperatorA (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'a', passive);

    this.name = 'add';
    this.info = 'Outputs the sum of inputs.';

    this.ports.haste.a = { x: -1, y: 0 };
    this.ports.input.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true };

    this.operation = function (force = false) {
      const a = this.listen(this.ports.haste.a, true);
      const b = this.listen(this.ports.input.b, true);
      return orca.keyOf(a + b)
    };
  }

  var a = OperatorA;

  function OperatorB (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'b', passive);

    this.name = 'bounce';
    this.info = 'Bounces between two values based on the runtime frame.';

    this.ports.haste.rate = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.input.mod = { x: 1, y: 0, default: '8' };
    this.ports.output = { x: 0, y: 1, sensitive: true };

    this.operation = function (force = false) {
      const rate = this.listen(this.ports.haste.rate, true);
      const mod = this.listen(this.ports.input.mod, true) - 1;
      const key = (Math.floor(orca.f / rate) % (mod * 2));
      return orca.keyOf(key <= mod ? key : mod - (key - mod))
    };
  }

  var b = OperatorB;

  function OperatorC (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'c', passive);

    this.name = 'clock';
    this.info = 'Outputs a constant value based on the runtime frame.';

    this.ports.haste.rate = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.input.mod = { x: 1, y: 0, default: '8' };
    this.ports.output = { x: 0, y: 1, sensitive: true };

    this.operation = function (force = false) {
      const rate = this.listen(this.ports.haste.rate, true);
      const mod = this.listen(this.ports.input.mod, true);
      const val = (Math.floor(orca.f / rate) % mod);
      return orca.keyOf(val)
    };
  }

  var c = OperatorC;

  function OperatorD (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'd', passive);

    this.name = 'delay';
    this.info = 'Bangs on a fraction of the runtime frame.';

    this.ports.haste.rate = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.input.mod = { x: 1, y: 0, default: '8' };
    this.ports.output = { x: 0, y: 1, bang: true };

    this.operation = function (force = false) {
      const rate = this.listen(this.ports.haste.rate, true);
      const mod = this.listen(this.ports.input.mod, true);
      const res = orca.f % (mod * rate);
      return res === 0 || mod === 1
    };
  }

  var d = OperatorD;

  function OperatorE (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'e', passive);

    this.name = 'east';
    this.info = 'Moves eastward, or bangs.';
    this.draw = false;

    this.haste = function () {
      this.move(1, 0);
      this.passive = false;
    };
  }

  var e = OperatorE;

  function OperatorF (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'f', passive);

    this.name = 'if';
    this.info = 'Bangs if both inputs are equal.';

    this.ports.haste.a = { x: -1, y: 0 };
    this.ports.input.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, bang: true };

    this.operation = function (force = false) {
      const a = this.listen(this.ports.haste.a);
      const b = this.listen(this.ports.input.b);
      return a === b && a !== '.' && b !== '.'
    };
  }

  var f = OperatorF;

  function OperatorG (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'g', passive);

    this.name = 'generator';
    this.info = 'Writes distant operators with offset.';

    this.ports.haste.x = { x: -3, y: 0, clamp: { min: 1 } };
    this.ports.haste.y = { x: -2, y: 0 };
    this.ports.haste.len = { x: -1, y: 0 };

    this.haste = function () {
      const len = this.listen(this.ports.haste.len, true);
      for (let x = 1; x <= len; x++) {
        orca.lock(this.x + x, this.y);
      }
    };

    this.operation = function (force = false) {
      const len = this.listen(this.ports.haste.len, true);
      const x = this.listen(this.ports.haste.x, true);
      const y = this.listen(this.ports.haste.y, true) + 1;

      for (let i = 0; i < len; i++) {
        this.ports.input[`val${i}`] = { x: i + 1, y: 0 };
        const res = this.listen(this.ports.input[`val${i}`]);
        this.ports.output = { x: x + i, y: y };
        this.output(`${res}`, true);
        this.ports.output.x -= len - 1;
      }
    };
  }

  var g = OperatorG;

  function OperatorH (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'h', passive);

    this.name = 'halt';
    this.info = 'Stops southward operators from operating.';

    this.ports.input.target = { x: 0, y: 1 };

    this.haste = function () {
      orca.lock(this.x + this.ports.input.target.x, this.y + this.ports.input.target.y);
    };
  }

  var h = OperatorH;

  function OperatorI (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'i', passive);

    this.name = 'increment';
    this.info = 'Increments southward operator.';

    this.ports.haste.step = { x: -1, y: 0, default: '1' };
    this.ports.input.mod = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true };

    this.operation = function (force = false) {
      const step = this.listen(this.ports.haste.step, true);
      const mod = this.listen(this.ports.input.mod, true);
      const val = this.listen(this.ports.output, true);
      return orca.keyOf((val + step) % (mod > 0 ? mod : 36))
    };
  }

  var i = OperatorI;

  function OperatorJ (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'j', passive);

    this.name = 'jumper';
    this.info = 'Outputs the northward operator.';

    this.ports.haste.val = { x: 0, y: -1 };
    this.ports.output = { x: 0, y: 1 };

    this.haste = function () {
      orca.lock(this.x, this.y + 1);
    };

    this.operation = function (force = false) {
      return this.listen(this.ports.haste.val)
    };
  }

  var j = OperatorJ;

  function OperatorK (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'k', passive);

    this.name = 'konkat';
    this.info = 'Outputs multiple variables.';

    this.ports.haste.len = { x: -1, y: 0 };

    this.haste = function () {
      this.len = this.listen(this.ports.haste.len, true);
      for (let x = 1; x <= this.len; x++) {
        orca.lock(this.x + x, this.y);
        const g = orca.glyphAt(this.x + x, this.y);
        if (g !== '.') {
          orca.lock(this.x + x, this.y + 1);
        }
      }
    };

    this.operation = function (force = false) {
      for (let x = 1; x <= this.len; x++) {
        const key = orca.glyphAt(this.x + x, this.y);
        orca.write(this.x + x, this.y + 1, orca.valueIn(key));
      }
    };
  }

  var k = OperatorK;

  function OperatorL (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'l', passive);

    this.name = 'loop';
    this.info = 'Loops a number of eastward operators.';

    this.ports.haste.step = { x: -2, y: 0, default: '1' };
    this.ports.haste.len = { x: -1, y: 0 };

    this.haste = function () {
      const len = this.listen(this.ports.haste.len, true);
      for (let x = 1; x <= len; x++) {
        orca.lock(this.x + x, this.y);
      }
    };

    this.operation = function (force = false) {
      const step = this.listen(this.ports.haste.step, true);
      const len = this.listen(this.ports.haste.len, true);
      const index = orca.indexAt(this.x + 1, this.y);
      const seg = orca.s.substr(index, len);
      const string = seg.substr(step, len - step) + seg.substr(0, step);
      for (let x = 0; x < len; x++) {
        orca.write(this.x + x + 1, this.y, string.charAt(x));
      }
    };
  }

  var l = OperatorL;

  function OperatorM (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'm', passive);

    this.name = 'multiply';
    this.info = 'Outputs the product of inputs.';

    this.ports.haste.a = { x: -1, y: 0 };
    this.ports.input.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true };

    this.operation = function (force = false) {
      const a = this.listen(this.ports.haste.a, true);
      const b = this.listen(this.ports.input.b, true);
      return orca.keyOf(a * b)
    };
  }

  var m = OperatorM;

  function OperatorN (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'n', passive);

    this.name = 'north';
    this.info = 'Moves Northward, or bangs.';
    this.draw = false;

    this.haste = function () {
      this.move(0, -1);
      this.passive = false;
    };
  }

  var n = OperatorN;

  function OperatorO (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'o', passive);

    this.name = 'read';
    this.info = 'Reads a distant operator with offset.';

    this.ports.haste.x = { x: -2, y: 0 };
    this.ports.haste.y = { x: -1, y: 0 };
    this.ports.haste.read = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1 };

    this.operation = function (force = false) {
      const x = this.listen(this.ports.haste.x, true);
      const y = this.listen(this.ports.haste.y, true);
      this.ports.haste.read = { x: x + 1, y: y };
      return this.listen(this.ports.haste.read)
    };
  }

  var o = OperatorO;

  function OperatorP (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'p', passive);

    this.name = 'push';
    this.info = 'Writes an eastward operator with offset.';

    this.ports.haste.len = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.haste.key = { x: -2, y: 0 };
    this.ports.input.val = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1 };

    this.haste = function () {
      const len = this.listen(this.ports.haste.len, true);
      for (let x = 0; x < len; x++) {
        orca.lock(this.x + x, this.y + 1);
      }
    };

    this.operation = function (force = false) {
      const len = this.listen(this.ports.haste.len, true);
      const key = this.listen(this.ports.haste.key, true);
      this.ports.output = { x: (key % len), y: 1 };
      return this.listen(this.ports.input.val)
    };
  }

  var p = OperatorP;

  function OperatorQ (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'q', passive);

    this.name = 'query';
    this.info = 'Reads distant operators with offset.';

    this.ports.haste.x = { x: -3, y: 0 };
    this.ports.haste.y = { x: -2, y: 0 };
    this.ports.haste.len = { x: -1, y: 0, clamp: { min: 1 } };

    this.haste = function () {
      const len = this.listen(this.ports.haste.len, true);
      const x = this.listen(this.ports.haste.x, true);
      const y = this.listen(this.ports.haste.y, true);
      for (let i = 1; i <= len; i++) {
        orca.lock(this.x + x + i, this.y + y);
      }
    };

    this.operation = function (force = false) {
      const len = this.listen(this.ports.haste.len, true);
      const x = this.listen(this.ports.haste.x, true);
      const y = this.listen(this.ports.haste.y, true);
      for (let i = 1; i <= len; i++) {
        this.ports.haste[`val${i}`] = { x: x + i, y: y };
        orca.lock(this.x + x + i, this.y + y);
        this.ports.output = { x: i - len, y: 1 };
        const res = this.listen(this.ports.haste[`val${i}`]);
        this.output(`${res}`);
      }
      this.ports.output = { x: 0, y: 1 };
    };
  }

  var q = OperatorQ;

  function OperatorR (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'r', passive);

    this.name = 'random';
    this.info = 'Outputs a random value.';

    this.ports.haste.min = { x: -1, y: 0 };
    this.ports.input.max = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true };

    this.operation = function (force = false) {
      const min = this.listen(this.ports.haste.min, true);
      const max = this.listen(this.ports.input.max, true);
      const val = parseInt((Math.random() * ((max > 0 ? max : 36) - min)) + min);
      return orca.keyOf(val)
    };
  }

  var r = OperatorR;

  function OperatorS (orca, x, y, passive) {
    operator.call(this, orca, x, y, 's', passive);

    this.name = 'south';
    this.info = 'Moves southward, or bangs.';
    this.draw = false;

    this.haste = function () {
      this.move(0, 1);
      this.passive = false;
    };
  }

  var s = OperatorS;

  function OperatorT (orca, x, y, passive) {
    operator.call(this, orca, x, y, 't', passive);

    this.name = 'track';
    this.info = 'Reads an eastward operator with offset.';

    this.ports.haste.key = { x: -2, y: 0 };
    this.ports.haste.len = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.haste.val = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1 };

    this.haste = function () {
      const len = this.listen(this.ports.haste.len, true);
      for (let x = 1; x <= len; x++) {
        orca.lock(this.x + x, this.y);
      }
    };

    this.operation = function (force = false) {
      const len = this.listen(this.ports.haste.len, true);
      const key = this.listen(this.ports.haste.key, true);
      this.ports.haste.val = { x: (key % len) + 1, y: 0 };
      return this.listen(this.ports.haste.val)
    };
  }

  var t = OperatorT;

  function OperatorU (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'u', passive);

    this.name = 'Uclid';
    this.info = 'Bangs based on the Euclidean pattern.';

    this.ports.haste.step = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.input.max = { x: 1, y: 0, clamp: { min: 1 } };
    this.ports.output = { x: 0, y: 1, bang: true };

    this.operation = function (force = false) {
      const step = this.listen(this.ports.haste.step, true);
      const max = this.listen(this.ports.input.max, true);
      let segs = [];
      for (let i = 0; i < max; i++) {
        segs.push([i < step ? 1 : 0]);
      }
      let l = 0;
      while (l = segs.length - 1) {
        let from = 0;
        while (from < l && segs[0].join('') === segs[from].join('')) { from++; }
        if (from === l) { break }
        let to = l;
        while (to > 0 && segs[l].join('') === segs[to].join('')) { to--; }
        if (to === 0) { break }
        const count = Math.min(from, l - to);
        segs = segs.slice(0, count).map((group, i) => {
          return group.concat(segs[l - i])
        }).concat(segs.slice(count, -count));
      }
      const sequence = [].concat.apply([], segs);
      return sequence[orca.f % sequence.length] === 1
    };
  }

  var u = OperatorU;

  function OperatorV (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'v', passive);

    this.name = 'variable';
    this.info = 'Reads and write globally available variables.';

    this.ports.haste.write = { x: -1, y: 0 };
    this.ports.input.read = { x: 1, y: 0 };

    this.haste = function () {
      const write = this.listen(this.ports.haste.write);
      const read = this.listen(this.ports.input.read);
      if (write === '.' && read !== '.') {
        this.ports.output = { x: 0, y: 1 };
      }
    };

    this.operation = function (force = false) {
      const write = this.listen(this.ports.haste.write);
      const read = this.listen(this.ports.input.read);
      if (write !== '.') {
        orca.variables[write] = read;
        return
      }
      return orca.valueIn(read)
    };
  }

  var v = OperatorV;

  function OperatorW (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'w', passive);

    this.name = 'west';
    this.info = 'Moves westward, or bangs.';
    this.draw = false;

    this.haste = function () {
      this.move(-1, 0);
      this.passive = false;
    };
  }

  var w = OperatorW;

  function OperatorX (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'x', passive);

    this.name = 'write';
    this.info = 'Writes a distant operator with offset.';

    this.ports.haste.x = { x: -2, y: 0 };
    this.ports.haste.y = { x: -1, y: 0 };
    this.ports.input.val = { x: 1, y: 0 };

    this.operation = function (force = false) {
      const x = this.listen(this.ports.haste.x, true);
      const y = this.listen(this.ports.haste.y, true) + 1;
      this.ports.output = { x: x, y: y };
      return this.listen(this.ports.input.val)
    };
  }

  var x = OperatorX;

  function OperatorY (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'y', passive);

    this.name = 'jymper';
    this.info = 'Outputs the westward operator.';

    this.ports.haste.val = { x: -1, y: 0 };
    this.ports.output = { x: 1, y: 0 };

    this.haste = function () {
      orca.lock(this.x + 1, this.y);
    };

    this.operation = function (force = false) {
      return this.listen(this.ports.haste.val)
    };
  }

  var y = OperatorY;

  function OperatorZ (orca, x, y, passive) {
    operator.call(this, orca, x, y, 'z', passive);

    this.name = 'Lerp';
    this.info = 'Transitions southward operator toward input.';

    this.ports.haste.rate = { x: -1, y: 0, default: '1' };
    this.ports.input.target = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true };

    this.operation = function (force = false) {
      const rate = this.listen(this.ports.haste.rate, true);
      const target = this.listen(this.ports.input.target, true);
      const val = this.listen(this.ports.output, true);
      const mod = val <= target - rate ? rate : val >= target + rate ? -rate : target - val;
      return orca.keyOf(val + mod)
    };
  }

  var z = OperatorZ;

  function OperatorBang (orca, x, y, passive) {
    operator.call(this, orca, x, y, '*', true);

    this.name = 'bang';
    this.info = 'Bangs neighboring operators.';
    this.draw = false;

    // Overwrite run, to disable draw.

    this.run = function (force = false) {

    };

    this.haste = function () {
      this.passive = true;
      this.erase();
    };
  }

  var _bang = OperatorBang;

  function OperatorComment (orca, x, y, passive) {
    operator.call(this, orca, x, y, '#', true);

    this.name = 'comment';
    this.info = 'Comments a line, or characters until the next hash.';
    this.draw = false;

    this.haste = function () {
      for (let x = this.x + 1; x <= orca.w; x++) {
        orca.lock(x, this.y);
        if (orca.glyphAt(x, this.y) === this.glyph) { break }
      }
      this.passive = false;
      orca.lock(this.x, this.y);
    };
  }

  var _comment = OperatorComment;

  function OperatorMidi (orca, x, y, passive) {
    operator.call(this, orca, x, y, ':', true);

    this.name = 'midi';
    this.info = 'Sends a MIDI note.';

    this.ports.input.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 } };
    this.ports.input.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } };
    this.ports.input.note = { x: 3, y: 0 };
    this.ports.input.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } };
    this.ports.input.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 16 } };

    this.operation = function (force = false) {
      if (!this.hasNeighbor('*') && force === false) { return }

      if (this.listen(this.ports.input.channel) === '.') { return }
      if (this.listen(this.ports.input.octave) === '.') { return }
      if (this.listen(this.ports.input.note) === '.') { return }

      const channel = this.listen(this.ports.input.channel, true);
      const rawOctave = this.listen(this.ports.input.octave, true);
      const rawNote = this.listen(this.ports.input.note);
      const rawVelocity = this.listen(this.ports.input.velocity, true);
      const length = this.listen(this.ports.input.length, true);

      const transposed = this.transpose(rawNote, rawOctave);
      // 1 - 8
      const octave = transposed.octave;
      // 0 - 11
      const note = transposed.value;
      // 0 - G(127)
      const velocity = parseInt((rawVelocity / 16) * 127);

      this.draw = false;

      terminal.io.midi.send(channel, octave, note, velocity, length);

      if (force === true) {
        terminal.io.midi.run();
      }
    };
  }

  var _midi = OperatorMidi;

  function OperatorMono (orca, x, y, passive) {
    operator.call(this, orca, x, y, ':', true);

    this.name = 'mono';
    this.info = 'Sends MIDI note to a monophonic instrument.';

    this.ports.input.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 } };
    this.ports.input.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } };
    this.ports.input.note = { x: 3, y: 0 };
    this.ports.input.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } };
    this.ports.input.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 16 } };

    this.operation = function (force = false) {
      if (!this.hasNeighbor('*') && force === false) { return }

      if (this.listen(this.ports.input.channel) === '.') { return }
      if (this.listen(this.ports.input.octave) === '.') { return }
      if (this.listen(this.ports.input.note) === '.') { return }

      const channel = this.listen(this.ports.input.channel, true);
      const rawOctave = this.listen(this.ports.input.octave, true);
      const rawNote = this.listen(this.ports.input.note);
      const rawVelocity = this.listen(this.ports.input.velocity, true);
      const length = this.listen(this.ports.input.length, true);

      const transposed = this.transpose(rawNote, rawOctave);
      // 1 - 8
      const octave = transposed.octave;
      // 0 - 11
      const note = transposed.value;
      // 0 - G(127)
      const velocity = parseInt((rawVelocity / 16) * 127);

      this.draw = false;

      terminal.io.mono.send(channel, octave, note, velocity, length);

      if (force === true) {
        terminal.io.mono.run();
      }
    };
  }

  var _mono = OperatorMono;

  function OperatorCC (orca, x, y) {
    operator.call(this, orca, x, y, '!', true);

    this.name = 'Midi CC';
    this.info = 'Sends a MIDI control change message.';

    this.ports.haste.channel = { x: 1, y: 0, clamp: { min: 0, max: 15 } };
    this.ports.haste.knob = { x: 2, y: 0, clamp: { min: 0 } };
    this.ports.input.value = { x: 3, y: 0, clamp: { min: 0 } };

    this.operation = function (force = false) {
      if (!this.hasNeighbor('*') && force === false) { return }

      if (this.listen(this.ports.haste.channel) === '.') { return }
      if (this.listen(this.ports.haste.knob) === '.') { return }

      const channel = this.listen(this.ports.haste.channel, true);
      const knob = this.listen(this.ports.haste.knob, true);
      const rawValue = this.listen(this.ports.input.value, true);

      const val = Math.ceil((127 * rawValue) / 35);

      this.draw = false;
      terminal.io.cc.send(channel, knob, val);

      if (force === true) {
        terminal.io.cc.run();
      }
    };
  }

  var _cc = OperatorCC;

  function OperatorUdp (orca, x, y, passive) {
    operator.call(this, orca, x, y, ';', true);

    this.name = 'udp';
    this.info = 'Sends a UDP message.';

    this.haste = function () {
      for (let x = 1; x <= 36; x++) {
        const g = orca.glyphAt(this.x + x, this.y);
        if (g === '.') { break }
        orca.lock(this.x + x, this.y);
      }
    };

    this.operation = function (force = false) {
      if (!this.hasNeighbor('*') && force === false) { return }

      let msg = '';
      for (let x = 1; x <= 36; x++) {
        const g = orca.glyphAt(this.x + x, this.y);
        if (g === '.') { break }
        msg += g;
      }

      if (msg === '') { return }

      this.draw = false;
      terminal.io.udp.send(msg);

      if (force === true) {
        terminal.io.udp.run();
      }
    };
  }

  var _udp = OperatorUdp;

  function OperatorOsc (orca, x, y, passive) {
    operator.call(this, orca, x, y, '=', true);

    this.name = 'osc';
    this.info = 'Sends a OSC message.';

    this.ports.haste.path = { x: 1, y: 0 };

    this.haste = function () {
      this.path = this.listen(this.ports.haste.path);
      this.msg = '';
      for (let x = 2; x <= 36; x++) {
        const g = orca.glyphAt(this.x + x, this.y);
        if (g === '.') { break }
        orca.lock(this.x + x, this.y);
        this.msg += g;
      }
    };

    this.operation = function (force = false) {
      if (!this.hasNeighbor('*') && force === false) { return }
      if (!this.path || this.path === '.') { return }
      this.draw = false;
      terminal.io.osc.send('/' + this.path, this.msg);

      if (force === true) {
        terminal.io.osc.run();
      }
    };
  }

  var _osc = OperatorOsc;

  function OperatorKeys (orca, x, y, passive) {
    operator.call(this, orca, x, y, ':', true);

    this.name = 'mono';
    this.info = 'Receive MIDI note.';

    this.ports.output = { x: 0, y: 1 };

    this.operation = function (force = false) {
      if (!terminal.io.midi.key) { return '.' }
      const octave = Math.floor(terminal.io.midi.key / 12);
      const value = terminal.io.midi.key % 12;
      const note = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'][value];
      const transposed = this.transpose(note, octave);
      return transposed && transposed.real ? transposed.real : '.'
    };
  }

  var _keys = OperatorKeys;

  var library = {
    '0': _null,
    '1': _null,
    '2': _null,
    '3': _null,
    '4': _null,
    '5': _null,
    '6': _null,
    '7': _null,
    '8': _null,
    '9': _null,
    'a': a,
    'b': b,
    'c': c,
    'd': d,
    'e': e,
    'f': f,
    'g': g,
    'h': h,
    'i': i,
    'j': j,
    'k': k,
    'l': l,
    'm': m,
    'n': n,
    'o': o,
    'p': p,
    'q': q,
    'r': r,
    's': s,
    't': t,
    'u': u,
    'v': v,
    'w': w,
    'x': x,
    'y': y,
    'z': z,
    '*': _bang,
    '#': _comment,
    ':': _midi,
    '%': _mono,
    '!': _cc,
    ';': _udp,
    '=': _osc,
    '&': _keys
  };

  function Orca (terminal) {
    this.w = 1; // Default Width
    this.h = 1; // Default Height
    this.f = 0; // Frame
    this.s = ''; // String

    this.terminal = terminal;
    this.keys = Object.keys(library).slice(0, 36);

    this.locks = [];
    this.runtime = [];
    this.variables = {};

    this.run = function () {
      this.runtime = this.parse();
      this.operate(this.runtime);
      this.f += 1;
    };

    this.reset = function (w = this.w, h = this.h) {
      this.f = 0;
      this.w = w;
      this.h = h;
      this.replace(new Array((this.h * this.w) + 1).join('.'));
    };

    this.load = function (w, h, s, f = 0) {
      this.w = w;
      this.h = h;
      this.f = f;
      this.replace(this.clean(s));
      return this
    };

    this.write = function (x, y, g) {
      if (!g) { return false }
      if (g.length !== 1) { return false }
      if (!this.inBounds(x, y)) { return false }
      if (this.glyphAt(x, y) === g) { return false }
      const index = this.indexAt(x, y);
      const glyph = !this.isAllowed(g) ? '.' : g;
      const string = this.s.substr(0, index) + glyph + this.s.substr(index + 1);
      this.replace(string);
      return true
    };

    this.clean = function (str) {
      return `${str}`.replace(/\n/g, '').trim().substr(0, this.w * this.h)
    };

    this.replace = function (s) {
      this.s = s;
    };

    // Operators

    this.parse = function () {
      const a = [];
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          const g = this.glyphAt(x, y);
          const operator = this.cast(g, x, y);
          if (operator) {
            a.push(operator);
          }
        }
      }
      return a
    };

    this.cast = function (g, x, y) {
      if (g === '.') { return }
      if (!library[g.toLowerCase()]) { return }
      const passive = g === g.toUpperCase();
      return new library[g.toLowerCase()](this, x, y, passive)
    };

    this.operate = function (operators) {
      this.release();
      for (const id in operators) {
        const operator = operators[id];
        if (this.lockAt(operator.x, operator.y)) { continue }
        if (operator.passive || operator.hasNeighbor('*')) {
          operator.haste();
          operator.permissions();
          operator.run();
        }
      }
    };

    this.bounds = function () {
      let w = 0;
      let h = 0;
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          const g = this.glyphAt(x, y);
          if (g !== '.') {
            if (x > w) { w = x; }
            if (y > h) { h = y; }
          }
        }
      }
      return { w: w, h: h }
    };

    // Locks

    this.release = function () {
      this.locks = new Array(this.w * this.h);
      this.variables = {};
    };

    this.unlock = function (x, y) {
      this.locks[this.indexAt(x, y)] = null;
    };

    this.lock = function (x, y) {
      if (this.lockAt(x, y)) { return }
      this.locks[this.indexAt(x, y)] = true;
    };

    // Helpers

    this.inBounds = function (x, y) {
      return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < this.w && y >= 0 && y < this.h
    };

    this.isAllowed = function (g) {
      return g === '.' || !!library[`${g}`.toLowerCase()]
    };

    this.keyOf = function (val) {
      return this.keys[val % 36]
    };

    this.valueOf = function (g) {
      return this.keys.indexOf(`${g}`.toLowerCase())
    };

    this.indexAt = function (x, y) {
      return this.inBounds(x, y) === true ? x + (this.w * y) : -1
    };

    this.operatorAt = function (x, y) {
      return this.runtime.filter((item) => { return item.x === x && item.y === y })[0]
    };

    this.posAt = function (index) {
      return { x: index % this.w, y: parseInt(index / this.w) }
    };

    this.glyphAt = function (x, y, req = null) {
      return this.s.charAt(this.indexAt(x, y))
    };

    this.lockAt = function (x, y) {
      return this.locks[this.indexAt(x, y)] === true
    };

    this.valueIn = function (key) {
      return this.variables[key]
    };

    // Tools

    this.format = function () {
      const a = [];
      for (let y = 0; y < this.h; y++) {
        a.push(this.s.substr(y * this.w, this.w));
      }
      return a.reduce((acc, val) => {
        return `${acc}${val}\n`
      }, '')
    };

    this.length = function () {
      return this.strip().length
    };

    this.strip = function () {
      return this.s.replace(/[^a-zA-Z0-9+]+/gi, '').trim()
    };

    this.toString = function () {
      return this.format().trim()
    };

    this.reset();
  }

  var orca = Orca;

  function Midi (terminal) {
    this.mode = 0;

    this.outputIndex = -1;
    this.inputIndex = -1;

    this.outputs = [];
    this.inputs = [];
    this.stack = [];

    this.key = null;

    this.start = function () {
      console.info('Midi Starting..');
      this.setup();
    };

    this.clear = function () {

    };

    this.update = function () {
      terminal.controller.clearCat('default', 'Midi');
      terminal.controller.add('default', 'Midi', `Refresh Device List`, () => { terminal.io.midi.setup(); terminal.io.midi.update(); });
      terminal.controller.addSpacer('default', 'Midi', 'spacer1');

      // Outputs
      if (this.outputs.length < 1) {
        terminal.controller.add('default', 'Midi', `No Midi Outputs`);
      } else {
        for (const id in this.outputs) {
          terminal.controller.add('default', 'Midi', `${this.outputs[id].name} Output ${terminal.io.midi.outputIndex === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.midi.selectOutput(id); }, '');
        }
        terminal.controller.add('default', 'Midi', `No Output ${terminal.io.midi.outputIndex === -1 ? ' — Active' : ''}`, () => { terminal.io.midi.selectOutput(-1); }, '');
        terminal.controller.addSpacer('default', 'Midi', 'spacer2');
      }

      // Inputs
      if (this.inputs.length < 1) {
        terminal.controller.add('default', 'Midi', `No Midi Inputs`);
      } else {
        for (const id in this.inputs) {
          terminal.controller.add('default', 'Midi', `${this.inputs[id].name} Input ${terminal.io.midi.inputIndex === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.midi.selectInput(id); }, '');
        }
        terminal.controller.add('default', 'Midi', `No Input ${terminal.io.midi.inputIndex === -1 ? ' — Active' : ''}`, () => { terminal.io.midi.selectInput(-1); }, '');
      }

      terminal.controller.commit();
    };

    this.run = function () {
      this.stack = this.stack.filter((item) => {
        const alive = item[4] > 0;
        const played = item[5];
        if (alive !== true) {
          this.trigger(item, false);
        } else if (played !== true) {
          this.trigger(item, true);
        }
        item[4]--;
        return alive
      });
    };

    this.trigger = function (item, down) {
      if (!this.outputDevice()) { console.warn('Midi', 'No midi output!'); return }

      const channel = down === true ? 0x90 + item[0] : 0x80 + item[0];
      const note = clamp(24 + (item[1] * 12) + item[2], 0, 127);
      const velocity = clamp(item[3], 0, 127);

      this.outputDevice().send([channel, note, velocity]);
      item[5] = true;
    };

    this.send = function (channel, octave, note, velocity, length, played = false) {
      for (const id in this.stack) {
        const item = this.stack[id];
        if (item[0] === channel && item[1] === octave && item[2] === note) {
          item[3] = velocity;
          item[4] = length;
          item[5] = played;
          return
        }
      }
      this.stack.push([channel, octave, note, velocity, length, played]);
    };

    this.silence = function () {
      this.stack = this.stack.filter((item) => {
        this.trigger(item, false);
        return false
      });
    };

    // Keys

    this.press = function (key) {
      this.key = parseInt(key);
    };

    this.release = function () {
      this.key = null;
    };

    // Clock

    this.ticks = [];

    // TODO
    this.sendClock = function () {
      if (!this.outputDevice()) { return }
      if (this.sendClock !== true) { return }

      const bpm = terminal.clock.speed.value;
      const frameTime = (60000 / bpm) / 4;
      const frameFrag = frameTime / 6;

      for (let id = 0; id < 6; id++) {
        if (this.ticks[id]) { clearTimeout(this.ticks[id]); }
        this.ticks[id] = setTimeout(() => { this.outputDevice().send([0xF8], 0); }, parseInt(id) * frameFrag);
      }
    };

    this.count = 0;

    this.receive = function (msg) {
      switch (msg.data[0]) {
        // Keys
        case 0x90:
          this.press(msg.data[1]);
          break
        case 0x80:
          this.release();
          break
        // Clock
        case 0xF8:
          this.count = (this.count + 1) % 6;
          if (this.count % 4 === 0) ;
          break
        case 0xFA:
          console.log('Midi', 'Clock start.');
          terminal.clock.play();
          break
        case 0xFC:
          console.log('Midi', 'Clock stop.');
          terminal.clock.stop();
          break
      }
    };

    // Tools

    this.selectOutput = function (id) {
      if (id === -1) { this.outputIndex = -1; console.log('Midi', `Select Output Device: None`); this.update(); return }
      if (!this.outputs[id]) { return }

      this.outputIndex = parseInt(id);
      console.log('Midi', `Select Output Device: ${this.outputDevice().name}`);
      this.update();
    };

    this.selectInput = function (id) {
      if (this.inputDevice()) { this.inputDevice().onmidimessage = null; }
      if (id === -1) { this.inputIndex = -1; console.log('Midi', `Select Input Device: None`); this.update(); return }
      if (!this.inputs[id]) { return }

      this.inputIndex = parseInt(id);
      this.inputDevice().onmidimessage = (msg) => { this.receive(msg); };
      console.log('Midi', `Select Input Device: ${this.inputDevice().name}`);
      this.update();
    };

    this.outputDevice = function () {
      return this.outputs[this.outputIndex]
    };

    this.inputDevice = function () {
      return this.inputs[this.inputIndex]
    };

    // Setup

    this.setup = function () {
      if (!navigator.requestMIDIAccess) { return }
      navigator.requestMIDIAccess({ sysex: false }).then(this.access, (err) => {
        console.warn('No Midi', err);
      });
    };

    this.access = function (midiAccess) {
      const outputs = midiAccess.outputs.values();
      terminal.io.midi.outputs = [];
      for (let i = outputs.next(); i && !i.done; i = outputs.next()) {
        terminal.io.midi.outputs.push(i.value);
      }
      terminal.io.midi.selectOutput(0);

      const inputs = midiAccess.inputs.values();
      terminal.io.midi.inputs = [];
      for (let i = inputs.next(); i && !i.done; i = inputs.next()) {
        terminal.io.midi.inputs.push(i.value);
      }
      terminal.io.midi.selectInput(-1);
    };

    // UI

    this.toString = function () {
      return this.outputDevice() ? `${this.outputDevice().name}` : 'No Midi'
    };

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var midi = Midi;

  function MidiCC (terminal) {
    this.stack = [];

    this.start = function () {
      console.info('MidiCC', 'Starting..');
    };

    this.clear = function () {
      this.stack = [];
    };

    this.run = function () {
      for (const id in this.stack) {
        this.play(this.stack[id]);
      }
    };

    this.send = function (channel, knob, value) {
      this.stack.push([channel, knob, value]);
    };

    this.play = function (data) {
      const device = terminal.io.midi.outputDevice();
      if (!device) { console.warn('MidiCC', `No Midi device.`); return }
      device.send([0xb0 + data[0], 64 + data[1], data[2]]);
    };
  }

  var cc = MidiCC;

  function Mono (terminal) {
    this.queue = null;
    this.stack = [];

    this.start = function () {
      console.info('Mono Starting..');
    };

    this.run = function () {
      if (this.stack[0]) {
        if (this.stack[0].length <= 1) {
          this.release();
        } else {
          this.stack[0].length--;
        }
      }

      if (this.queue) {
        this.press();
      }
    };

    this.press = function (item = this.queue) {
      if (!item) { return }
      if (this.stack[0]) { this.release(); }
      this.trigger(item, true);
      this.stack[0] = item;
      this.queue = null;
    };

    this.release = function (item = this.stack[0]) {
      if (!item) { return }
      this.trigger(this.stack[0], false);
      this.stack = [];
    };

    this.clear = function () {

    };

    this.trigger = function (item, down) {
      if (!terminal.io.midi.outputDevice()) { console.warn('Mono', 'No midi output!'); return }
      if (!item) { return }

      const channel = down === true ? 0x90 + item.channel : 0x80 + item.channel;
      const note = clamp(24 + (item.octave * 12) + item.note, 0, 127);
      const velocity = clamp(item.velocity, 0, 127);

      terminal.io.midi.outputDevice().send([channel, note, velocity]);
    };

    this.send = function (channel, octave, note, velocity, length) {
      this.queue = { channel, octave, note, velocity, length };
    };

    this.silence = function () {
      this.release();
    };

    // UI

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var mono = Mono;

  const dgram = require('dgram');

  function Udp (terminal) {
    this.stack = [];
    this.port = null;
    this.options = { default: 49161, orca: 49160 };

    this.start = function () {
      console.info('UDP Starting..');
      this.select();
    };

    this.clear = function () {
      this.stack = [];
    };

    this.run = function () {
      for (const id in this.stack) {
        this.play(this.stack[id]);
      }
    };

    this.send = function (msg) {
      this.stack.push(msg);
    };

    this.play = function (data) {
      this.server.send(Buffer.from(`${data}`), this.port, '127.0.0.1', (err) => {
        if (err) { console.warn(err); }
      });
    };

    this.select = function (port = this.options.default) {
      if (port < 1000) { console.warn('Unavailable port'); return }
      this.port = port;
      this.update();
    };

    this.update = function () {
      console.log(`UDP Port: ${this.port}`);
      terminal.controller.clearCat('default', 'UDP');
      for (const id in this.options) {
        terminal.controller.add('default', 'UDP', `${id.charAt(0).toUpperCase() + id.substr(1)}(${this.options[id]}) ${this.port === this.options[id] ? ' — Active' : ''}`, () => { terminal.io.udp.select(this.options[id]); }, '');
      }
      terminal.controller.commit();
    };

    this.server = dgram.createSocket('udp4');
    this.listener = dgram.createSocket('udp4');

    // Input

    this.listener.on('message', (msg, rinfo) => {
      return terminal.commander.trigger(`${msg}`)
    });

    this.listener.on('listening', () => {
      const address = this.listener.address();
      console.log(`UDP Listening: ${address.address}:${address.port}`);
    });

    this.listener.on('error', (err) => {
      console.warn(`Server error:\n ${err.stack}`);
      this.listener.close();
    });

    this.listener.bind(49160);
  }

  var udp = Udp;

  const osc = require('node-osc');

  function Osc (terminal) {
    this.stack = [];
    this.port = null;
    this.options = { default: 49162, tidalCycles: 6010, sonicPi: 4559 };

    this.start = function () {
      console.info('OSC Starting..');
      this.setup();
      this.select();
    };

    this.clear = function () {
      this.stack = [];
    };

    this.run = function () {
      for (const id in this.stack) {
        this.play(this.stack[id]);
      }
    };

    this.send = function (path, msg) {
      this.stack.push({ path, msg });
    };

    this.play = function ({ path, msg }) {
      if (!this.client) { return }
      const oscMsg = new osc.Message(path);
      for (var i = 0; i < msg.length; i++) {
        oscMsg.append(terminal.orca.valueOf(msg.charAt(i)));
      }
      this.client.send(oscMsg, (err) => {
        if (err) { console.warn(err); }
      });
    };

    this.select = function (port = this.options.default) {
      if (port < 1000) { console.warn('Unavailable port'); return }
      this.port = port;
      this.setup();
      this.update();
    };

    this.update = function () {
      console.log(`OSC Port: ${this.port}`);
      terminal.controller.clearCat('default', 'OSC');
      for (const id in this.options) {
        terminal.controller.add('default', 'OSC', `${id.charAt(0).toUpperCase() + id.substr(1)}(${this.options[id]}) ${this.port === this.options[id] ? ' — Active' : ''}`, () => { terminal.io.osc.select(this.options[id]); }, '');
      }
      terminal.controller.commit();
    };

    this.setup = function (ip = '127.0.0.1') {
      if (this.client) { this.client.close(); }
      this.client = new osc.Client(ip, this.port);
    };
  }

  var osc_1 = Osc;

  function IO (terminal) {
    this.midi = new midi(terminal);
    this.cc = new cc(terminal);
    this.mono = new mono(terminal);
    this.udp = new udp(terminal);
    this.osc = new osc_1(terminal);

    this.start = function () {
      this.midi.start();
      this.cc.start();
      this.mono.start();
      this.udp.start();
      this.osc.start();
      this.clear();
    };

    this.clear = function () {
      this.midi.clear();
      this.cc.clear();
      this.mono.clear();
      this.udp.clear();
      this.osc.clear();
    };

    this.run = function () {
      this.midi.run();
      this.cc.run();
      this.mono.run();
      this.udp.run();
      this.osc.run();
    };

    this.silence = function () {
      this.midi.silence();
      this.mono.silence();
    };

    this.length = function () {
      return this.midi.stack.length + this.cc.stack.length + this.udp.stack.length + this.osc.stack.length + this.mono.stack.length
    };

    this.inspect = function (limit = terminal.grid.w) {
      let text = '';
      for (let i = 0; i < this.length(); i++) {
        text += '|';
      }
      return fill(text, limit, '.')
    };

    function fill (str, len, chr) { while (str.length < len) { str += chr; } return str }
  }

  var io = IO;

  const { clipboard } = require('electron');

  function Cursor (terminal) {
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.mode = 0;
    this.block = [];

    this.move = function (x, y) {
      this.x = clamp(this.x + x, 0, terminal.orca.w - 1);
      this.y = clamp(this.y - y, 0, terminal.orca.h - 1);
      terminal.update();
    };

    this.moveTo = function (x, y) {
      this.x = clamp(x, 0, terminal.orca.w - 1);
      this.y = clamp(y, 0, terminal.orca.h - 1);
      terminal.update();
    };

    this.scale = function (x, y) {
      this.w = clamp(this.w + x, 1, terminal.orca.w - this.x);
      this.h = clamp(this.h - y, 1, terminal.orca.h - this.y);
      terminal.update();
    };

    this.resize = function (w, h) {
      this.w = clamp(w, 1, terminal.orca.w - this.x);
      this.h = clamp(h, 1, terminal.orca.h - this.y);
      terminal.update();
    };

    this.drag = function (x, y) {
      this.mode = 0;
      this.cut();
      this.move(x, y);
      this.paste();
    };

    this.reset = function (pos = false) {
      if (pos) {
        this.x = 0;
        this.y = 0;
      }
      this.move(0, 0);
      this.w = 1;
      this.h = 1;
      this.mode = 0;
    };

    this.selectAll = function () {
      this.x = 0;
      this.y = 0;
      this.w = terminal.orca.w;
      this.h = terminal.orca.h;
      this.mode = 0;
      terminal.update();
    };

    this.copy = function () {
      const block = this.getBlock();
      var rows = [];
      for (var i = 0; i < block.length; i++) {
        rows.push(block[i].join(''));
      }
      const result = rows.join('\n');
      clipboard.writeText(result);
    };

    this.cut = function () {
      this.copy();
      this.erase();
    };

    this.paste = function (overlap = false) {
      this.writeBlock(clipboard.readText().split(/\r?\n/), overlap);
    };

    this.read = function () {
      return terminal.orca.glyphAt(this.x, this.y)
    };

    this.write = function (g) {
      if (terminal.orca.write(this.x, this.y, g) && this.mode === 1) {
        this.move(1, 0);
      }
      terminal.history.record(terminal.orca.s);
    };

    this.erase = function (key) {
      this.eraseBlock(this.x, this.y, this.w, this.h);
      if (this.mode === 1) { this.move(-1, 0); }
      terminal.history.record(terminal.orca.s);
    };

    this.find = function (str) {
      const i = terminal.orca.s.indexOf(str);
      if (i < 0) { return }
      const pos = terminal.orca.posAt(i);
      this.w = str.length;
      this.h = 1;
      this.x = pos.x;
      this.y = pos.y;
    };

    this.trigger = function () {
      const operator = terminal.orca.operatorAt(this.x, this.y);
      if (!operator) { console.warn('Cursor', 'Nothing to trigger.'); return }
      console.log('Cursor', 'Trigger: ' + operator.name);
      operator.run(true);
    };

    this.toggleMode = function (val) {
      this.w = 1;
      this.h = 1;
      this.mode = this.mode === 0 ? val : 0;
    };

    this.inspect = function (name = true, ports = false) {
      if (this.w > 1 || this.h > 1) { return 'multi' }
      const port = terminal.portAt(this.x, this.y);
      if (port) { return `${port[3]}` }
      if (terminal.orca.lockAt(this.x, this.y)) { return 'locked' }
      return 'empty'
    };

    this.comment = function () {
      const block = this.getBlock();
      for (const id in block) {
        block[id][0] = block[id][0] === '#' ? '.' : '#';
        block[id][block[id].length - 1] = block[id][block[id].length - 1] === '#' ? '.' : '#';
      }
      this.writeBlock(block);
    };

    // Block

    this.getBlock = function () {
      const rect = this.toRect();
      const block = [];
      for (let _y = rect.y; _y < rect.y + rect.h; _y++) {
        const line = [];
        for (let _x = rect.x; _x < rect.x + rect.w; _x++) {
          line.push(terminal.orca.glyphAt(_x, _y));
        }
        block.push(line);
      }
      return block
    };

    this.writeBlock = function (block, overlap = false) {
      if (!block || block.length === 0) { return }
      const rect = this.toRect();
      let _y = rect.y;
      for (const lineId in block) {
        let _x = rect.x;
        for (const glyphId in block[lineId]) {
          const glyph = block[lineId][glyphId];
          terminal.orca.write(_x, _y, overlap === true && glyph === '.' ? terminal.orca.glyphAt(_x, _y) : glyph);
          _x++;
        }
        _y++;
      }
      terminal.history.record(terminal.orca.s);
    };

    this.eraseBlock = function (x, y, w, h) {
      for (let _y = y; _y < y + h; _y++) {
        for (let _x = x; _x < x + w; _x++) {
          terminal.orca.write(_x, _y, '.');
        }
      }
      terminal.history.record(terminal.orca.s);
    };

    this.toRect = function () {
      return { x: this.x, y: this.y, w: this.w, h: this.h }
    };

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var cursor = Cursor;

  function Source (terminal) {
    const fs = require('fs');
    const path = require('path');
    const { dialog, app } = require('electron').remote;

    this.path = null;

    this.start = function () {
      this.new();
    };

    this.new = function () {
      console.log('Source', 'Make a new file..');
      this.path = null;
      terminal.orca.reset();
      terminal.resize();
      terminal.history.reset();
      terminal.cursor.reset();
      terminal.clock.play();
    };

    this.open = function () {
      console.log('Source', 'Open a file..');
      let paths = dialog.showOpenDialog(app.win, { properties: ['openFile'], filters: [{ name: 'Orca Machines', extensions: ['orca'] }] });
      if (!paths) { console.log('Nothing to load'); return }
      this.read(paths[0]);
    };

    this.save = function (quitAfter = false) {
      console.log('Source', 'Save a file..');
      if (this.path) {
        this.write(this.path, this.generate(), quitAfter);
      } else {
        this.saveAs(quitAfter);
      }
    };

    this.saveAs = function (quitAfter = false) {
      console.log('Source', 'Save a file as..');
      dialog.showSaveDialog((loc) => {
        if (loc === undefined) { return }
        if (loc.indexOf('.orca') < 0) { loc += '.orca'; }
        this.write(loc, this.generate(), quitAfter);
        this.path = loc;
      });
    };

    this.revert = function () {
      if (!this.path) { return }
      console.log('Source', 'Revert a file..');
      this.read(this.path);
    };

    // I/O

    this.write = function (loc, data = this.generate(), quitAfter = false) {
      console.log('Source', 'Writing ' + loc);
      fs.writeFileSync(loc, data);
      terminal.source.remember('active', loc);
      if (quitAfter === true) {
        app.exit();
      }
    };

    this.read = function (loc = this.path) {
      if (!loc) { return }
      if (!fs.existsSync(loc)) { console.warn('Source', 'File does not exist: ' + loc); return }
      console.log('Source', 'Reading ' + loc);
      this.path = loc;
      this.remember('active', loc);

      //
      const data = fs.readFileSync(loc, 'utf8');
      const lines = data.split('\n').map((line) => { return clean(line) });
      const w = lines[0].length;
      const h = lines.length;
      const s = lines.join('\n').trim();

      terminal.orca.load(w, h, s);
      terminal.history.reset();
      terminal.history.record(terminal.orca.s);
      terminal.updateSize();
    };

    this.quit = function () {
      if (this.hasChanges() === true) {
        this.verify();
      } else {
        app.exit();
      }
    };

    this.verify = function () {
      let response = dialog.showMessageBox(app.win, {
        type: 'question',
        buttons: ['Cancel', 'Discard', 'Save'],
        title: 'Confirm',
        message: 'Unsaved data will be lost. Would you like to save your changes before leaving?',
        icon: path.join(__dirname, '../../icon.png')
      });
      if (response === 2) {
        this.save(true);
      } else if (response === 1) {
        app.exit();
      }
    };

    this.hasChanges = function () {
      console.log('Source', 'Looking for changes..');
      if (!this.path) {
        console.log('Source', 'File is unsaved..');
        if (terminal.orca.length() > 2) {
          console.log('Source', `File is not empty.`);
          return true
        }
      } else {
        if (fs.existsSync(this.path)) {
          console.log('Source', 'Comparing with last saved copy..');
          const diff = isDifferent(fs.readFileSync(this.path, 'utf8'), this.generate());
          if (diff === true) {
            console.log('Source', 'File has been changed.');
            return true
          }
        } else {
          console.log('Source', 'File does not exist.');
          return true
        }
      }
    };

    // LocalStorage

    this.resume = function () {
      this.read(this.recall('active'));
    };

    this.remember = function (key, val) {
      if (!key || !val) { return }
      console.log('Source', `Remember: ${key}=${val}`);
      localStorage.setItem(key, val);
    };

    this.recall = function (key) {
      if (!key) { return }
      if (localStorage.hasOwnProperty(key)) {
        console.log('Source', `Recall: ${key}`);
        return localStorage.getItem(key)
      }
    };

    this.forget = function (key) {
      if (!key) { return }
      console.log('Source', `Forget: ${key}`);
      localStorage.removeItem(key);
    };

    // Converters

    this.generate = function (orca = terminal.orca) {
      return `${orca}`
    };

    this.parse = function (text) {
      const lines = text.split('\n').map((line) => { return clean(line) });
      const w = lines[0].length;
      const h = lines.length;
      const s = lines.join('\n').trim();
      return terminal.orca.load(w, h, s)
    };

    // Etc

    this.name = function () {
      return this.path ? path.basename(this.path, '.orca') : null
    };

    this.folder = function () {
      return this.path ? path.dirname(this.path) : null
    };

    this.toString = function () {
      return this.path ? this.name() : 'blank'
    };

    function isDifferent (a, b) {
      return a.replace(/[^a-zA-Z0-9+]+/gi, '').trim() !== b.replace(/[^a-zA-Z0-9+]+/gi, '').trim()
    }

    function clean (s) {
      let c = '';
      for (let x = 0; x <= s.length; x++) {
        const char = s.charAt(x);
        c += !terminal.orca.isAllowed(char) ? '.' : char;
      }
      return c
    }
  }

  var source = Source;

  function History () {
    this.index = 0;
    this.frames = [];
    this.host = null;
    this.key = null;

    this.bind = function (host, key) {
      console.log(`History is recording..`);
      this.host = host;
      this.key = key;
      this.reset();
    };

    this.reset = function () {
      this.index = 0;
      this.frames = [];
    };

    this.record = function (data) {
      if (this.index === this.frames.length) {
        this.append(data);
      } else {
        this.fork(data);
      }
      this.trim();
      this.index = this.frames.length;
    };

    this.undo = function () {
      if (this.index === 0) { console.warn('History', 'Reached beginning'); return }
      this.index = clamp(this.index - 1, 0, this.frames.length - 2);
      this.apply(this.frames[this.index]);
    };

    this.redo = function () {
      if (this.index + 1 > this.frames.length - 1) { console.warn('History', 'Reached end'); return }
      this.index = clamp(this.index + 1, 0, this.frames.length - 1);
      this.apply(this.frames[this.index]);
    };

    this.apply = function (f) {
      if (!this.host[this.key]) { console.log(`Unknown binding to key ${this.key}`); return }
      if (!f || f.length !== this.host[this.key].length) { return }
      this.host[this.key] = this.frames[this.index];
    };

    this.append = function (data) {
      if (!data) { return }
      if (this.frames[this.index - 1] && this.frames[this.index - 1] === data) { return }
      this.frames.push(data);
    };

    this.fork = function (data) {
      this.frames = this.frames.slice(0, this.index + 1);
      this.append(data);
    };

    this.trim = function (limit = 30) {
      if (this.frames.length < limit) { return }
      this.frames.shift();
    };

    this.last = function () {
      return this.frames[this.index - 1]
    };

    this.length = function () {
      return this.frames.length
    };

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var history = History;

  const Patterns = function (terminal) {
    const fs = require('fs');
    const path = require('path');

    this.collection = {};

    // Writers
    this.collection['vion'] = `iV......oV......nV`;
    this.collection['vionvl'] = `iV......oV......nV......vV......lV`;

    // Readers
    this.collection['kion'] = `3Kion\n.:...`;
    this.collection['kionvl'] = `5Kionvl\n.:.....`;

    // Notes
    this.collection['oct'] = `.7TCDEFGAB\n..C.......`;
    this.collection['oct#'] = `.7Tcdefgab\n..C.......`;
    this.collection['scale'] = `cTCcDdEFfGgAaB\n.C............`;
    this.collection['ca44'] = `.C4\nA04`;
    this.collection['dy'] = `D8\n.Y`;

    this.find = function (name) {
      // Statics
      if (this.collection[name]) {
        return this.collection[name]
      }
      // Dynamics
      if (terminal.source.path) {
        const target = path.join(terminal.source.folder(), name + '.orca');
        if (fs.existsSync(target)) {
          const data = fs.readFileSync(target, 'utf8');
          const cleanData = data.split('\n').map((line) => { return clean(line) }).join('\n');
          return this.add(name, cleanData)
        }
      }
      return null
    };

    this.add = function (name, data) {
      console.log('Patterns', `Added "${name}".`);
      this.collection[name] = data;
      return data
    };

    function clean (s) {
      let c = '';
      for (let x = 0; x <= s.length; x++) {
        const char = s.charAt(x);
        c += !terminal.orca.isAllowed(char) ? '.' : char;
      }
      return c
    }
  };

  var patterns = Patterns;

  function Commander (terminal) {
    const Patterns = patterns;
    this.patterns = new Patterns(terminal);

    this.isActive = false;
    this.query = '';

    this.start = function (q = '') {
      this.isActive = true;
      this.query = q;
      terminal.update();
    };

    this.stop = function () {
      this.isActive = false;
      this.query = '';
      terminal.update();
    };

    this.erase = function () {
      this.query = this.query.slice(0, -1);
      this.preview();
    };

    this.write = function (key) {
      if (key.length !== 1) { return }
      this.query += key;
      this.preview();
    };

    this.run = function () {
      const tool = this.isActive === true ? 'commander' : 'cursor';
      terminal[tool].trigger();
      terminal.update();
    };

    this.operations = {
      'apm': (val) => { terminal.clock.set(null, parseInt(val)); },
      'bpm': (val) => { terminal.clock.set(parseInt(val), parseInt(val), true); },
      'color': (val) => {
        const parts = val.split(';');
        if (isColor(parts[0])) { terminal.theme.active.b_med = '#' + parts[0]; }
        if (isColor(parts[1])) { terminal.theme.active.b_inv = '#' + parts[1]; }
        if (isColor(parts[2])) { terminal.theme.active.b_high = '#' + parts[2]; }
      },
      'find': (val) => { terminal.cursor.find(val); },
      'move': (val) => {
        const pos = val.split(';');
        const x = parseInt(pos[0]);
        const y = parseInt(pos[1]);
        if (!isNaN(x) && !isNaN(y)) {
          terminal.cursor.moveTo(x, y);
        }
      },
      'play': (val) => { terminal.clock.play(); },
      'rot': (val) => {
        const cols = terminal.cursor.getBlock();
        for (const y in cols) {
          for (const x in cols[y]) {
            if (cols[y][x] === '.') { continue }
            const isUC = cols[y][x] === cols[y][x].toUpperCase();
            cols[y][x] = terminal.orca.keyOf(parseInt(val) + terminal.orca.valueOf(cols[y][x]));
            if (isUC) {
              cols[y][x] = cols[y][x].toUpperCase();
            }
          }
        }
        terminal.cursor.writeBlock(cols);
      },
      'run': (val) => { terminal.run(); },
      'stop': (val) => { terminal.clock.stop(); },
      'time': (val) => { terminal.clock.setFrame(parseInt(val)); },
      'write': (val) => {
        const g = val.substr(0, 1);
        const pos = val.substr(1).split(';');
        const x = pos[0] ? parseInt(pos[0]) : terminal.cursor.x;
        const y = pos[1] ? parseInt(pos[1]) : terminal.cursor.y;
        if (!isNaN(x) && !isNaN(y) && g) {
          terminal.orca.write(x, y, g);
        }
      }
    };

    // Make shorthands
    for (const id in this.operations) {
      this.operations[id.substr(0, 1)] = this.operations[id];
    }

    this.trigger = function (msg = this.query) {
      const cmd = `${msg}`.split(':')[0].toLowerCase();
      const val = `${msg}`.substr(cmd.length + 1);

      if (this.operations[cmd]) {
        this.operations[cmd](val);
      } else if (this.patterns.find(msg)) {
        this.inject(this.patterns.find(msg));
      } else {
        console.warn(`Unknown message: ${msg}`);
      }

      this.stop();
    };

    // Injections

    this.inject = function (pattern) {
      if (!pattern) { return }
      terminal.cursor.writeBlock(pattern.trim().split('\n'));
      terminal.cursor.reset();
    };

    this.preview = function () {
      const pattern = this.patterns.find(this.query);
      if (!pattern) { return }
      const result = pattern.trim().split('\n');
      terminal.cursor.resize(result[0].length, result.length);
    };

    this.onKeyDown = function (event) {
      // Reset
      if ((event.metaKey || event.ctrlKey) && event.key === 'Backspace') {
        terminal.reset();
        event.preventDefault();
        return
      }

      if (event.keyCode === 191 && (event.metaKey || event.ctrlKey)) { terminal.cursor.comment(); event.preventDefault(); return }

      // Copy/Paste
      if (event.keyCode === 67 && (event.metaKey || event.ctrlKey)) { terminal.cursor.copy(); event.preventDefault(); return }
      if (event.keyCode === 88 && (event.metaKey || event.ctrlKey)) { terminal.cursor.cut(); event.preventDefault(); return }
      if (event.keyCode === 86 && (event.metaKey || event.ctrlKey) && event.shiftKey) { terminal.cursor.paste(true); event.preventDefault(); return }
      if (event.keyCode === 86 && (event.metaKey || event.ctrlKey)) { terminal.cursor.paste(false); event.preventDefault(); return }
      if (event.keyCode === 65 && (event.metaKey || event.ctrlKey)) { terminal.cursor.selectAll(); event.preventDefault(); return }

      // Undo/Redo
      if (event.keyCode === 90 && (event.metaKey || event.ctrlKey) && event.shiftKey) { terminal.history.redo(); event.preventDefault(); return }
      if (event.keyCode === 90 && (event.metaKey || event.ctrlKey)) { terminal.history.undo(); event.preventDefault(); return }

      if (event.keyCode === 38) { this.onArrowUp(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
      if (event.keyCode === 40) { this.onArrowDown(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
      if (event.keyCode === 37) { this.onArrowLeft(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }
      if (event.keyCode === 39) { this.onArrowRight(event.shiftKey, (event.metaKey || event.ctrlKey), event.altKey); return }

      if (event.keyCode === 9) { terminal.toggleHardmode(); event.preventDefault(); return }

      if (event.metaKey) { return }
      if (event.ctrlKey) { return }

      if (event.key === ' ' && terminal.cursor.mode === 0) { terminal.clock.togglePlay(); event.preventDefault(); return }
      if (event.key === 'Escape') { terminal.commander.stop(); terminal.clear(); terminal.isPaused = false; terminal.cursor.reset(); return }
      if (event.key === 'Backspace') { terminal[this.isActive === true ? 'commander' : 'cursor'].erase(); event.preventDefault(); return }

      if (event.key === ']') { terminal.modGrid(1, 0); event.preventDefault(); return }
      if (event.key === '[') { terminal.modGrid(-1, 0); event.preventDefault(); return }
      if (event.key === '}') { terminal.modGrid(0, 1); event.preventDefault(); return }
      if (event.key === '{') { terminal.modGrid(0, -1); event.preventDefault(); return }
      if (event.key === '>') { terminal.clock.mod(1); event.preventDefault(); return }
      if (event.key === '<') { terminal.clock.mod(-1); event.preventDefault(); return }

      // Route key to Operator or Cursor
      terminal[this.isActive === true ? 'commander' : 'cursor'].write(event.key);
    };

    this.onKeyUp = function (event) {
      terminal.update();
    };

    this.onArrowUp = function (mod = false, skip = false, drag = false) {
      const leap = skip ? terminal.grid.h : 1;
      if (drag) {
        terminal.cursor.drag(0, leap);
      } else if (mod) {
        terminal.cursor.scale(0, leap);
      } else {
        terminal.cursor.move(0, leap);
      }
    };

    this.onArrowDown = function (mod = false, skip = false, drag = false) {
      const leap = skip ? terminal.grid.h : 1;
      if (drag) {
        terminal.cursor.drag(0, -leap);
      } else if (mod) {
        terminal.cursor.scale(0, -leap);
      } else {
        terminal.cursor.move(0, -leap);
      }
    };

    this.onArrowLeft = function (mod = false, skip = false, drag = false) {
      const leap = skip ? terminal.grid.w : 1;
      if (drag) {
        terminal.cursor.drag(-leap, 0);
      } else if (mod) {
        terminal.cursor.scale(-leap, 0);
      } else {
        terminal.cursor.move(-leap, 0);
      }
    };

    this.onArrowRight = function (mod = false, skip = false, drag = false) {
      const leap = skip ? terminal.grid.w : 1;
      if (drag) {
        terminal.cursor.drag(leap, 0);
      } else if (mod) {
        terminal.cursor.scale(leap, 0);
      } else {
        terminal.cursor.move(leap, 0);
      }
    };

    // Events

    document.onkeydown = (event) => { this.onKeyDown(event); };
    document.onkeyup = (event) => { this.onKeyUp(event); };

    // UI

    this.toString = function () {
      return `${this.query}`
    };

    function isColor (str) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#' + str)
    }
  }

  var commander = Commander;

  function Clock (terminal) {
    this.isPaused = true;
    this.timer = null;

    this.speed = { value: 120, target: 120 };

    this.start = function () {
      this.setTimer(120);
      this.play();
    };

    this.touch = function () {
      this.stop();
      terminal.run();
    };

    this.update = function () {
      // Animate
      if (this.speed.target !== this.speed.value) {
        this.set(this.speed.value + (this.speed.value < this.speed.target ? 1 : -1), null, true);
      }
    };

    this.set = function (value, target = null, setTimer = false) {
      if (value) { this.speed.value = clamp(value, 60, 300); }
      if (target) { this.speed.target = clamp(target, 60, 300); }
      if (setTimer === true) { this.setTimer(this.speed.value); }
    };

    this.mod = function (mod = 0, animate = false) {
      if (animate === true) {
        this.set(null, this.speed.target + mod);
      } else {
        this.set(this.speed.value + mod, this.speed.value + mod, true);
        terminal.update();
      }
    };

    // Controls

    this.togglePlay = function () {
      // If in insert mode, insert space
      if (terminal.cursor.mode === 1) {
        terminal.cursor.move(1, 0);
        return
      }
      if (this.isPaused === true) {
        this.play();
      } else {
        this.stop();
      }
    };

    this.play = function () {
      if (!this.isPaused) { console.warn('Already playing'); return }
      console.log('Clock', 'Play');
      this.isPaused = false;
      this.set(this.speed.target, this.speed.target, true);
    };

    this.stop = function () {
      if (this.isPaused) { console.warn('Already stopped'); return }
      console.log('Clock', 'Stop');
      terminal.io.midi.silence();
      this.isPaused = true;
      this.clearTimer();
    };

    // Midi Tap

    this.intervals = [];
    this.lastTap = 0;

    this.tap = function () {
      if (this.intervals.length > 8) {
        this.intervals.shift();
      }
      if (this.intervals.length === 8) {
        const sum = this.intervals.reduce((sum, interval) => { return sum + interval });
        const bpm = parseInt((1000 / sum) * 60);
        if (Math.abs(bpm - this.speed.target) > 1) {
          this.set(null, bpm);
        }
      }

      const now = performance.now();
      this.intervals.push(now - this.lastTap);
      this.lastTap = now;
    };

    // Timer

    this.clearTimer = function () {
      if (this.timer) {
        clearInterval(this.timer);
      }
    };

    this.setTimer = function (bpm) {
      console.log('Clock', `Setting new ${bpm} timer..`);
      this.clearTimer();
      this.timer = setInterval(() => { terminal.run(); this.update(); }, (60000 / bpm) / 4);
    };

    this.resetFrame = function () {
      terminal.orca.f = 0;
    };

    this.setFrame = function (f) {
      if (isNaN(f)) { return }
      terminal.orca.f = clamp(f, 0, 9999999);
    };

    // UI

    this.toString = function () {
      const diff = this.speed.target - this.speed.value;
      const _offset = Math.abs(diff) > 5 ? (diff > 0 ? `+${diff}` : diff) : '';
      const _beat = diff === 0 && terminal.orca.f % 4 === 0 ? '*' : '';
      return `${this.speed.value}${_offset}${_beat}`
    };

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var clock = Clock;

  function Theme (_default) {
    const themer = this;

    this.active = _default;

    this.el = document.createElement('style');
    this.el.type = 'text/css';

    this.install = function (host = document.body, callback) {
      host.appendChild(this.el);
      this.callback = callback;
    };

    this.start = function () {
      console.log('Theme', 'Starting..');
      if (isJson(localStorage.theme)) {
        const storage = JSON.parse(localStorage.theme);
        if (validate(storage)) {
          console.log('Theme', 'Loading localStorage..');
          this.load(storage);
          return
        }
      }
      this.load(_default);
    };

    this.load = function (data) {
      const theme = parse(data);
      if (!validate(theme)) { console.warn('Theme', 'Not a theme', theme); return }
      console.log('Theme', `Loaded theme!`);
      this.el.innerHTML = `:root { --background: ${theme.background}; --f_high: ${theme.f_high}; --f_med: ${theme.f_med}; --f_low: ${theme.f_low}; --f_inv: ${theme.f_inv}; --b_high: ${theme.b_high}; --b_med: ${theme.b_med}; --b_low: ${theme.b_low}; --b_inv: ${theme.b_inv}; }`;
      localStorage.setItem('theme', JSON.stringify(theme));
      this.active = theme;
      if (this.callback) {
        this.callback();
      }
    };

    this.reset = function () {
      this.load(_default);
    };

    function parse (any) {
      if (any && any.background) { return any } else if (any && any.data) { return any.data } else if (any && isJson(any)) { return JSON.parse(any) } else if (any && isHtml(any)) { return extract(any) }
      return null
    }

    // Drag

    this.drag = function (e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };

    this.drop = function (e) {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (!file || !file.name) { console.warn('Theme', 'Unnamed file.'); return }
      if (file.name.indexOf('.thm') < 0 && file.name.indexOf('.svg') < 0) { console.warn('Theme', 'Skipped, not a theme'); return }
      const reader = new FileReader();
      reader.onload = function (e) {
        themer.load(e.target.result);
      };
      reader.readAsText(file);
    };

    this.open = function () {
      const fs = require('fs');
      const { dialog, app } = require('electron').remote;
      let paths = dialog.showOpenDialog(app.win, { properties: ['openFile'], filters: [{ name: 'Themes', extensions: ['svg'] }] });
      if (!paths) { console.log('Nothing to load'); return }
      fs.readFile(paths[0], 'utf8', function (err, data) {
        if (err) throw err
        themer.load(data);
      });
    };

    window.addEventListener('dragover', this.drag);
    window.addEventListener('drop', this.drop);

    // Helpers

    function validate (json) {
      if (!json) { return false }
      if (!json.background) { return false }
      if (!json.f_high) { return false }
      if (!json.f_med) { return false }
      if (!json.f_low) { return false }
      if (!json.f_inv) { return false }
      if (!json.b_high) { return false }
      if (!json.b_med) { return false }
      if (!json.b_low) { return false }
      if (!json.b_inv) { return false }
      return true
    }

    function extract (text) {
      const svg = new DOMParser().parseFromString(text, 'text/xml');
      try {
        return {
          'background': svg.getElementById('background').getAttribute('fill'),
          'f_high': svg.getElementById('f_high').getAttribute('fill'),
          'f_med': svg.getElementById('f_med').getAttribute('fill'),
          'f_low': svg.getElementById('f_low').getAttribute('fill'),
          'f_inv': svg.getElementById('f_inv').getAttribute('fill'),
          'b_high': svg.getElementById('b_high').getAttribute('fill'),
          'b_med': svg.getElementById('b_med').getAttribute('fill'),
          'b_low': svg.getElementById('b_low').getAttribute('fill'),
          'b_inv': svg.getElementById('b_inv').getAttribute('fill')
        }
      } catch (err) {
        console.warn('Theme', 'Incomplete SVG Theme', err);
      }
    }

    function isJson (text) {
      try { JSON.parse(text); return true } catch (error) { return false }
    }

    function isHtml (text) {
      try { new DOMParser().parseFromString(text, 'text/xml'); return true } catch (error) { return false }
    }
  }

  var theme = Theme;

  function Controller () {
    const fs = require('fs');
    const { dialog, app } = require('electron').remote;

    this.menu = { default: {} };
    this.mode = 'default';

    this.app = require('electron').remote.app;

    this.start = function () {
    };

    this.add = function (mode, cat, label, fn, accelerator) {
      if (!this.menu[mode]) { this.menu[mode] = {}; }
      if (!this.menu[mode][cat]) { this.menu[mode][cat] = {}; }
      this.menu[mode][cat][label] = { fn: fn, accelerator: accelerator };
    };

    this.addRole = function (mode, cat, label) {
      if (!this.menu[mode]) { this.menu[mode] = {}; }
      if (!this.menu[mode][cat]) { this.menu[mode][cat] = {}; }
      this.menu[mode][cat][label] = { role: label };
    };

    this.addSpacer = function (mode, cat, label, type = 'separator') {
      if (!this.menu[mode]) { this.menu[mode] = {}; }
      if (!this.menu[mode][cat]) { this.menu[mode][cat] = {}; }
      this.menu[mode][cat][label] = { type: type };
    };

    this.clearCat = function (mode, cat) {
      if (this.menu[mode]) { this.menu[mode][cat] = {}; }
    };

    this.set = function (mode = 'default') {
      this.mode = mode;
      this.commit();
    };

    this.format = function () {
      const f = [];
      const m = this.menu[this.mode];
      for (const cat in m) {
        const submenu = [];
        for (const name in m[cat]) {
          const option = m[cat][name];
          if (option.role) {
            submenu.push({ role: option.role });
          } else if (option.type) {
            submenu.push({ type: option.type });
          } else {
            submenu.push({ label: name, accelerator: option.accelerator, click: option.fn });
          }
        }
        f.push({ label: cat, submenu: submenu });
      }
      return f
    };

    this.commit = function () {
      console.log('Controller', 'Changing..');
      this.app.injectMenu(this.format());
    };

    this.accelerator = function (key, menu) {
      const acc = { basic: null, ctrl: null };
      for (cat in menu) {
        const options = menu[cat];
        for (const id in options.submenu) {
          const option = options.submenu[id]; if (option.role) { continue }
          acc.basic = (option.accelerator.toLowerCase() === key.toLowerCase()) ? option.label.toUpperCase().replace('TOGGLE ', '').substr(0, 8).trim() : acc.basic;
          acc.ctrl = (option.accelerator.toLowerCase() === ('CmdOrCtrl+' + key).toLowerCase()) ? option.label.toUpperCase().replace('TOGGLE ', '').substr(0, 8).trim() : acc.ctrl;
        }
      }
      return acc
    };

    this.docs = function () {
      // TODO
      console.log(this.menu.default);
    };
  }

  var controller = Controller;

  function Terminal () {
    const Orca = orca;
    const IO = io;
    const Cursor = cursor;
    const Source = source;
    const History = history;
    const Commander = commander;
    const Clock = clock;
    const Theme = theme;
    const Controller = controller;

    this.version = 114;
    this.library = library;

    this.orca = new Orca(this);
    this.io = new IO(this);
    this.cursor = new Cursor(this);
    this.source = new Source(this);
    this.commander = new Commander(this);
    this.clock = new Clock(this);
    this.history = new History();
    this.controller = new Controller();

    // Themes
    this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' });

    this.el = document.createElement('canvas');
    this.context = this.el.getContext('2d');

    // Settings
    this.grid = { w: 8, h: 8 };
    this.tile = {
      w: +localStorage.getItem('tilew') || 10,
      h: +localStorage.getItem('tileh') || 15
    };
    this.scale = window.devicePixelRatio;
    this.hardmode = true;

    this.install = function (host) {
      host.appendChild(this.el);
      this.theme.install(host);
    };

    this.start = function () {
      this.theme.start();
      this.io.start();
      this.source.start();
      this.history.bind(this.orca, 's');
      this.history.record(this.orca.s);
      this.clock.start();
      this.update();
      this.el.className = 'ready';
    };

    this.run = function () {
      this.io.clear();
      this.orca.run();
      this.io.run();
      this.update();
    };

    this.update = function () {
      this.clear();
      this.ports = this.findPorts();
      this.drawProgram();
      this.drawInterface();
    };

    this.reset = function () {
      this.theme.reset();
    };

    this.setGrid = function (w, h) {
      this.grid.w = w;
      this.grid.h = h;
      this.update();
    };

    this.setSize = function (size) {
      const win = require('electron').remote.getCurrentWindow();
      const winSize = win.getSize();
      const targetSize = [parseInt(size.w + 60), parseInt(size.h + 60 + this.tile.h)];

      if (winSize[0] === targetSize[0] && winSize[1] === targetSize[1]) { return }

      console.log(`Window Size: ${targetSize[0]}x${targetSize[1]}, from ${winSize[0]}x${winSize[1]}`);

      win.setSize(targetSize[0], targetSize[1], false);
      this.resize();
    };

    this.updateSize = function () {
      console.log('Terminal', 'Update size');
      this.setSize({ w: this.orca.w * this.tile.w, h: this.orca.h * this.tile.h });
    };

    this.toggleRetina = function () {
      this.scale = this.scale === 1 ? window.devicePixelRatio : 1;
      console.log('Terminal', `Pixel resolution: ${this.scale}`);
      this.resize(true);
    };

    this.toggleHardmode = function () {
      this.hardmode = this.hardmode !== true;
      console.log('Terminal', `Hardmode: ${this.hardmode}`);
      this.update();
    };

    this.modGrid = function (x = 0, y = 0) {
      const w = clamp(this.grid.w + x, 4, 16);
      const h = clamp(this.grid.h + y, 4, 16);
      this.setGrid(w, h);
    };

    this.modZoom = function (mod = 0, reset = false) {
      this.tile = {
        w: reset ? 10 : this.tile.w * (mod + 1),
        h: reset ? 15 : this.tile.h * (mod + 1)
      };
      localStorage.setItem('tilew', this.tile.w);
      localStorage.setItem('tileh', this.tile.h);
      this.resize(true);
    };

    //

    this.isCursor = function (x, y) {
      return x === this.cursor.x && y === this.cursor.y
    };

    this.isSelection = function (x, y) {
      return !!(x >= this.cursor.x && x < this.cursor.x + this.cursor.w && y >= this.cursor.y && y < this.cursor.y + this.cursor.h)
    };

    this.isMarker = function (x, y) {
      return x % this.grid.w === 0 && y % this.grid.h === 0
    };

    this.isNear = function (x, y) {
      return x > (parseInt(this.cursor.x / this.grid.w) * this.grid.w) - 1 && x <= ((1 + parseInt(this.cursor.x / this.grid.w)) * this.grid.w) && y > (parseInt(this.cursor.y / this.grid.h) * this.grid.h) - 1 && y <= ((1 + parseInt(this.cursor.y / this.grid.h)) * this.grid.h)
    };

    this.isAligned = function (x, y) {
      return x === this.cursor.x || y === this.cursor.y
    };

    this.isEdge = function (x, y) {
      return x === 0 || y === 0 || x === this.orca.w - 1 || y === this.orca.h - 1
    };

    this.isLocals = function (x, y) {
      return this.isNear(x, y) === true && (x % (this.grid.w / 4) === 0 && y % (this.grid.h / 4) === 0) === true
    };

    this.portAt = function (x, y) {
      return this.ports[this.orca.indexAt(x, y)]
    };

    this.findPorts = function () {
      const a = new Array((this.orca.w * this.orca.h) - 1);
      for (const id in this.orca.runtime) {
        const operator = this.orca.runtime[id];
        if (this.orca.lockAt(operator.x, operator.y)) { continue }
        const ports = operator.getPorts();
        for (const i in ports) {
          const port = ports[i];
          const index = this.orca.indexAt(port[0], port[1]);
          a[index] = port;
        }
      }
      return a
    };

    // Interface

    this.makeGlyph = function (x, y) {
      const g = this.orca.glyphAt(x, y);
      if (g !== '.') { return g }
      if (this.isCursor(x, y)) { return this.isPaused ? '~' : '@' }
      if (this.isMarker(x, y)) { return '+' }
      return g
    };

    this.makeStyle = function (x, y, glyph, selection) {
      const isLocked = this.orca.lockAt(x, y);
      const port = this.ports[this.orca.indexAt(x, y)];
      if (this.isSelection(x, y)) { return 4 }
      if (!port && glyph === '.' && isLocked === false && this.hardmode === true) { return this.isLocals(x, y) === true ? 9 : 7 }
      if (selection === glyph && isLocked === false && selection !== '.') { return 6 }
      if (port) { return port[2] }
      if (isLocked === true) { return 5 }
      return 9
    };

    this.makeTheme = function (type) {
      // Operator
      if (type === 0) { return { bg: this.theme.active.b_med, fg: this.theme.active.f_low } }
      // Haste
      if (type === 1) { return { fg: this.theme.active.b_med } }
      // Input
      if (type === 2) { return { fg: this.theme.active.b_high } }
      // Output
      if (type === 3) { return { bg: this.theme.active.b_high, fg: this.theme.active.f_low } }
      // Selected
      if (type === 4) { return { bg: this.theme.active.b_inv, fg: this.theme.active.f_inv } }
      // Locked
      if (type === 5) { return { fg: this.theme.active.f_med } }
      // LikeCursor
      if (type === 6) { return { fg: this.theme.active.b_inv } }
      // Invisible
      if (type === 7) { return {} }
      // Default
      return { fg: this.theme.active.f_low }
    };

    // Canvas

    this.clear = function () {
      this.context.clearRect(0, 0, this.el.width, this.el.height);
    };

    this.drawProgram = function () {
      const selection = this.cursor.read();
      for (let y = 0; y < this.orca.h; y++) {
        for (let x = 0; x < this.orca.w; x++) {
          const glyph = this.makeGlyph(x, y);
          const style = this.makeStyle(x, y, glyph, selection);
          this.drawSprite(x, y, glyph, style);
        }
      }
    };

    this.drawInterface = function () {
      const col = this.grid.w;
      const variables = Object.keys(this.orca.variables).join('');
      // Cursor
      this.write(`${this.cursor.x},${this.cursor.y}${this.cursor.mode === 1 ? '+' : ''}`, col * 0, 1, this.grid.w, this.cursor.mode === 1 ? 1 : 2);
      this.write(`${this.cursor.w}:${this.cursor.h}`, col * 1, 1, this.grid.w);
      this.write(`${this.cursor.inspect()}`, col * 2, 1, this.grid.w);
      this.write(`${this.orca.f}f${this.isPaused ? '*' : ''}`, col * 3, 1, this.grid.w);
      this.write(`${display(variables, this.orca.f, this.grid.w)}`, col * 4, 1, this.grid.w);
      // Grid
      this.write(`${this.orca.w}x${this.orca.h}`, col * 0, 0, this.grid.w);
      this.write(`${this.grid.w}/${this.grid.h}`, col * 1, 0, this.grid.w);
      this.write(`${this.source}`, col * 2, 0, this.grid.w);
      this.write(`${this.clock}`, col * 3, 0, this.grid.w, this.io.midi.inputIndex > -1 ? 4 : 2);
      this.write(`${this.io.inspect(this.grid.w)}`, col * 4, 0, this.grid.w);

      if (this.orca.f < 20) {
        this.write(`${this.io.midi}`, col * 5, 0, this.grid.w * 2);
      }

      if (this.commander.isActive === true) {
        this.write(`${this.commander.query}${this.orca.f % 2 === 0 ? '_' : ''}`, col * 5, 1, this.grid.w * 2, 1);
      } else if (this.orca.f < 8 && this.orca.f % 2 === 0) {
        this.write(`v${this.version}`, col * 5, 1, this.grid.w * 2, 5);
      }
    };

    this.drawSprite = function (x, y, g, type) {
      const theme = this.makeTheme(type);
      if (theme.bg) {
        const bgrect = { x: x * this.tile.w * this.scale, y: (y) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale };
        this.context.fillStyle = theme.bg;
        this.context.fillRect(bgrect.x, bgrect.y, bgrect.w, bgrect.h);
      }
      if (theme.fg) {
        const fgrect = { x: (x + 0.5) * this.tile.w * this.scale, y: (y + 1) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale };
        this.context.fillStyle = theme.fg;
        this.context.fillText(g, fgrect.x, fgrect.y);
      }
    };

    this.write = function (text, offsetX, offsetY, limit, type = 2) {
      let x = 0;
      while (x < text.length && x < limit - 1) {
        this.drawSprite(offsetX + x, this.orca.h + offsetY, text.substr(x, 1), type);
        x += 1;
      }
    };

    // Resize tools

    this.resize = function (force = false) {
      const size = { w: window.innerWidth - 60, h: window.innerHeight - (60 + this.tile.h * 2) };
      const tiles = { w: Math.floor(size.w / this.tile.w), h: Math.floor(size.h / this.tile.h) };

      if (this.orca.w === tiles.w && this.orca.h === tiles.h && force === false) { return }

      // Limit Tiles to Bounds
      const bounds = this.orca.bounds();
      if (tiles.w <= bounds.w) { tiles.w = bounds.w + 1; }
      if (tiles.h <= bounds.h) { tiles.h = bounds.h + 1; }
      this.crop(tiles.w, tiles.h);

      // Keep cursor in bounds
      if (this.cursor.x >= tiles.w) { this.cursor.x = tiles.w - 1; }
      if (this.cursor.y >= tiles.h) { this.cursor.y = tiles.h - 1; }

      console.log(`Resized to: ${tiles.w}x${tiles.h}`);

      this.el.width = this.tile.w * this.orca.w * this.scale;
      this.el.height = (this.tile.h + (this.tile.h / 5)) * this.orca.h * this.scale;
      this.el.style.width = `${parseInt(this.tile.w * this.orca.w)}px`;
      this.el.style.height = `${parseInt((this.tile.h + (this.tile.h / 5)) * this.orca.h)}px`;

      this.context.textBaseline = 'bottom';
      this.context.textAlign = 'center';
      this.context.font = `${this.tile.h * 0.75 * this.scale}px input_mono_medium`;

      this.update();
    };

    this.crop = function (w, h) {
      let block = `${this.orca}`;

      if (h > this.orca.h) {
        block = `${block}${`\n${'.'.repeat(this.orca.w)}`.repeat((h - this.orca.h))}`;
      } else if (h < this.orca.h) {
        block = `${block}`.split('\n').slice(0, (h - this.orca.h)).join('\n').trim();
      }

      if (w > this.orca.w) {
        block = `${block}`.split('\n').map((val) => { return val + ('.').repeat((w - this.orca.w)) }).join('\n').trim();
      } else if (w < this.orca.w) {
        block = `${block}`.split('\n').map((val) => { return val.substr(0, val.length + (w - this.orca.w)) }).join('\n').trim();
      }

      this.history.reset();
      this.orca.load(w, h, block, this.orca.f);
    };

    this.docs = function () {
      return Object.keys(this.library).reduce((acc, id) => { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(id) < 0 ? `${acc}- ${new this.library[id]().docs()}\n` : acc }, '')
    };

    // Events

    window.addEventListener('dragover', (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];
      const path = file.path ? file.path : file.name;

      if (!path || path.indexOf('.orca') < 0) { console.log('Orca', 'Not a orca file'); return }

      terminal.source.read(path);
    });

    window.onresize = (event) => {
      terminal.resize();
    };

    // Helpers

    function display (str, f, max) { return str.length < max ? str : str.slice(f % str.length) + str.substr(0, f % str.length) }
    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var terminal_1 = Terminal;

  return terminal_1;

}());
