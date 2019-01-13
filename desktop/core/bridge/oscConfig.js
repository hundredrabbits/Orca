'use strict'

module.exports = {
  name: 'Orca OSC',
  protocol: 'osc',

  defs: {
    'A': {
      address: '127.0.0.1',
      port: 12000,
      path: '/test',
      pattern: 'ifs'
    },
    'a': {
      address: '127.0.0.1',
      port: 12001,
      path: '/ctrla',
      name: 'a',
      pattern: 's'
    },
    '0': {
      address: '127.0.0.1',
      port: 6010,
      path: '/ctrl0',
      name: '0',
      pattern: 'i'
    }
  }
}
