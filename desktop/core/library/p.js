'use strict'

const Fn = require('../fn')

function FnP (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'p', passive)

  this.name = 'push'
  this.info = 'Moves away on bang.'

  this.run = function () {
    const bang = this.bang()
    if (!bang) { return }
    this.move(-bang.x, -bang.y)
  }
}

module.exports = FnP
