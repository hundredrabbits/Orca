'use strict'

const Patterns = function (terminal) {
  const fs = require('fs')

  this.collection = {}

  // Writers
  this.collection['vion'] = `iV......oV......nV`
  this.collection['vionvl'] = `iV......oV......nV......vV......lV`

  // Readers
  this.collection['kion'] = `3Kion\n.:...`
  this.collection['kionvl'] = `5Kionvl\n.:.....`

  // Notes
  this.collection['oct'] = `.7TCDEFGAB\n..C.......`
  this.collection['oct#'] = `.7Tcdefgab\n..C.......`
  this.collection['scale'] = `cTCcDdEFfGgAaB\n.C............`
  this.collection['ca44'] = `.C4\nA04`
  this.collection['dy'] = `D8\n.Y`

  this.find = function (name) {
    // Statics
    if (this.collection[name]) {
      return this.collection[name]
    }
    // Dynamics
    if (terminal.source.path) {
      const path = terminal.source.folder() + '/' + name + '.orca'
      if (fs.existsSync(path)) {
        return this.add(name, fs.readFileSync(path, 'utf8'))
      }
    }
    return null
  }

  this.add = function (name, data) {
    console.log('Patterns', `Added "${name}".`)
    this.collection[name] = data
    return data
  }
}

module.exports = Patterns
