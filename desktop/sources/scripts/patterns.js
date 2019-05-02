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
  this.collection['42f'] = `D4\n.:03C`
  this.collection['hh8'] = `D2\n.:13C`
  this.collection['sn24'] = `D8\n.:23C`
  this.collection['bass'] = `..Cg2..\nD12gTC.\n.:34.51`
  this.collection['lead'] = `..Cg2..\nD12gTC.\n.:54.51`

  this.find = function (name) {
    // Statics
    if (this.collection[name]) {
      return this.collection[name]
    }
    // Dynamics
    if (terminal.source.path) {
      const path = terminal.source.folder() + '/' + name + '.orca'
      if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf8')
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
