'use strict'

module.exports = {
  num: {
    '0': require('./lib/_null'),
    '1': require('./lib/_null'),
    '2': require('./lib/_null'),
    '3': require('./lib/_null'),
    '4': require('./lib/_null'),
    '5': require('./lib/_null'),
    '6': require('./lib/_null'),
    '7': require('./lib/_null'),
    '8': require('./lib/_null'),
    '9': require('./lib/_null')
  },
  alpha: {
    a: require('./lib/a'),
    b: require('./lib/b'),
    c: require('./lib/c'),
    d: require('./lib/d'),
    e: require('./lib/e'),
    f: require('./lib/f'),
    g: require('./lib/g'),
    h: require('./lib/h'),
    i: require('./lib/i'),
    j: require('./lib/j'),
    k: require('./lib/k'),
    l: require('./lib/l'),
    m: require('./lib/m'),
    n: require('./lib/n'),
    o: require('./lib/o'),
    p: require('./lib/p'),
    q: require('./lib/q'),
    r: require('./lib/r'),
    s: require('./lib/s'),
    t: require('./lib/t'),
    u: require('./lib/u'),
    v: require('./lib/v'),
    w: require('./lib/w'),
    x: require('./lib/x'),
    y: require('./lib/y'),
    z: require('./lib/z')
  },
  special: {
    '.': require('./lib/_null'),
    ':': require('./lib/_query'),
    '-': require('./lib/_wireh'),
    '|': require('./lib/_wirev'),
    '*': require('./lib/_wiren'),
    '+': require('./lib/_wiref')
  },
  queries: {
    'bpm': require('./lib/__bpm'),
    'vol': require('./lib/__vol'),
    'qqq': require('./lib/__qqq')
  }
}
