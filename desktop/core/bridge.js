'use strict'

function Bridge (io) {
  this.active = 'none'

  this.routes = {
    'none': { name: 'None' },
    'tidal': require('./bridge/tidal'),
    'sonicpi': require('./bridge/sonicpi')
  }

  this.start = function () {
    console.log(this.routes)
  }

  this.select = function (id) {
    console.log('select', id)
    this.active = id
    io.update()
  }
}

module.exports = Bridge
