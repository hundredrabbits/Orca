'use strict'

function Source (orca, terminal) {
  const fs = require('fs')
  const { dialog, app } = require('electron').remote

  this.path = null

  this.new = function () {
    orca.clear()
    console.log('New')
    this.path = null
  }

  this.open = function () {
    console.log('Open')

    let paths = dialog.showOpenDialog(app.win, { properties: ['openFile'] })
    if (!paths) { console.log('Nothing to load') }
    if (!terminal.source.validate(paths[0])) { console.log('Invalid file') }
    this.path = paths[0]
    this.read(paths[0])
  }

  this.save = function (as = false) {
    console.log('Save')

    if (this.path && !as) {
      this.write(this.path)
    } else {
      dialog.showSaveDialog((path) => {
        if (path === undefined) { return }
        if (path.indexOf('.orca') < 0) { path += '.orca' }
        terminal.source.write(path)
        terminal.source.path = path
      })
    }
  }

  this.revert = function () {
    console.log('Revert')
    this.read(this.path)
  }

  // I/O

  this.write = function (path) {
    fs.writeFile(path, `${orca}`, (err) => {
      if (err) { alert('An error ocurred updating the file' + err.message); console.log(err) }
    })
  }

  this.read = function (path) {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) throw err
      if (!terminal.source.validate(data)) { console.warn('Invalid File'); return }
      terminal.load(data.trim())
    })
  }

  this.validate = function (data) {
    return true
  }

  this.name = function () {
    const parts = this.path.split('/')
    return parts[parts.length - 1].replace('.orca', '').trim()
  }

  this.toString = function () {
    return this.path ? this.name() : 'blank'
  }
}

module.exports = Source
