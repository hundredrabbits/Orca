'use strict'

function Source (terminal) {
  const Orca = require('../../core/orca')
  const fs = require('fs')
  const { dialog, app } = require('electron').remote

  this.path = null

  this.new = function () {
    console.log('New')

    this.path = null

    terminal.rooms = { hall: new Orca(terminal) }
    terminal.room = terminal.rooms.hall
    terminal.enter()
    terminal.resize()
    terminal.history.reset()
  }

  this.open = function () {
    console.log('Open')
    let paths = dialog.showOpenDialog(app.win, { properties: ['openFile'], filters: [{ name: 'Orca Machines', extensions: ['orca'] }] })
    if (!paths) { console.log('Nothing to load') }
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
    fs.writeFile(path, this.generate(), (err) => {
      if (err) { alert('An error ocurred updating the file' + err.message); console.log(err) }
    })
  }

  this.read = function (path) {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err
      const rooms = this.parse(data)
      terminal.load(rooms)
      terminal.history.record()
    })
  }

  // Converters

  this.generate = function (rooms = terminal.rooms) {
    let html = `${rooms.hall}\n\n`
    for (const id in rooms) {
      if (id !== 'hall') {
        const room = rooms[id]
        html += `${id}\n\n${room}\n\n`
      }
    }
    return html.trim()
  }

  this.parse = function (text) {
    const lines = text.split('\n')
    const blocks = { hall: [] }
    const rooms = { hall: [] }
    const room = []
    let key = 'hall'
    // Blocks
    for (const id in lines) {
      const line = lines[id].trim()
      if (line.length === 0) { continue }
      if (line.length === 1) { key = line; continue }
      if (!blocks[key]) { blocks[key] = [] }
      blocks[key].push(line)
    }
    // Rooms
    for (const id in blocks) {
      const block = blocks[id]
      const w = block[0].length
      const h = block.length
      const s = block.join('\n').trim()
      rooms[id] = new Orca(terminal).load(w, h, s)
    }
    return rooms
  }

  // Etc

  this.name = function () {
    const parts = this.path.split('/')
    return parts[parts.length - 1].replace('.orca', '').trim()
  }

  this.toString = function () {
    return this.path ? this.name() : 'blank'
  }
}

module.exports = Source
