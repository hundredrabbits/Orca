'use strict'

function QQQ () {
  this.volume = 1

  this.setVolume = function (value) {
    this.volume = parseInt(value) / 100.0
  }
}

module.exports = QQQ
