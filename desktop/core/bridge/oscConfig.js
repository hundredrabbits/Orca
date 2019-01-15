'use strict'

module.exports = {
  name: 'Orca OSC',
  protocol: 'osc',
  address: '127.0.0.1',
  port: 12000,

  defs: {
    myKey: {
      path: '/Hello/Orca'
    },
    A: {
      path: '/ctrlA',
      pattern: 'i'
    },
    B: {
      path: '/ctrlB',
      pattern: 'f'
    },
    C: {
      address: '127.0.0.1',
      port: 3333,
      path: '/ctrlC',
      pattern: 's'
    },
    D: {
      address: '127.0.0.1',
      port: 3333,
      path: '/ctrlD',
      pattern: 'ifs'
    }
  }
}
