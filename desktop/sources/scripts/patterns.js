'use strict'

const Patterns = function (terminal) {
  const fs = require('fs')
  const path = require('path')

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
      const target = path.join(terminal.source.folder(), name + '.orca')
      if (fs.existsSync(target)) {
        const data = fs.readFileSync(target, 'utf8')
        const cleanData = data.split('\n').map((line) => { return clean(line) }).join('\n')
        return this.add(name, cleanData)
      }
    }
    return null
  }

  this.add = function (name, data) {
    console.log('Patterns', `Added "${name}".`)
    this.collection[name] = data
    return data
  }

  function clean (s) {
    let c = ''
    for (let x = 0; x <= s.length; x++) {
      const char = s.charAt(x)
      c += !terminal.orca.isAllowed(char) ? '.' : char
    }
    return c
  }
}

module.exports = Patterns
