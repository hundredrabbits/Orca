'use strict'

function Bridge (terminal) {
  this.index = 0
  this.active = 'none'
  this.stack = []

  this.routes = []

  this.start = function () {
    console.info('Starting Bridge(UDP/OSC)..')
    this.setup()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.update = function () {
    terminal.controller.clearCat('default', 'UDP Bridge')
    for (const id in terminal.io.bridge.routes) {
      terminal.controller.add('default', 'UDP Bridge', `${this.routes[id].name} ${this.index === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.bridge.select(id) }, '')
    }
    terminal.controller.commit()
  }

  this.select = function (id) {
    console.log(id)
    // if (!this.routes[id]) { console.warn(`Unknown bridge:${id}`); return }
    // console.log('Select bridge: ', id)
    // this.active = id
    // terminal.io.update()
  }

  this.route = function () {
    return this.routes[this.index]
  }

  this.setup = function () {
    this.routes = [
      { name: 'None' },
      require('../../core/bridge/tidal'),
      require('../../core/bridge/sonicpi')
    ]
    this.update()
  }
}

module.exports = Bridge
