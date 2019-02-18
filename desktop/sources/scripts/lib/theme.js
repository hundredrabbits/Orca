'use strict'

function Theme (_default) {
  const themer = this

  this.active = _default

  this.el = document.createElement('style')
  this.el.type = 'text/css'

  this.install = function (host = document.body, callback) {
    host.appendChild(this.el)
    this.callback = callback
  }

  this.start = function () {
    console.log('Theme', 'Starting..')
    if (isJson(localStorage.theme)) {
      const storage = JSON.parse(localStorage.theme)
      if (validate(storage)) {
        console.log('Theme', 'Loading localStorage..')
        this.load(storage)
        return
      }
    }
    this.load(_default)
  }

  this.load = function (data) {
    const theme = parse(data)
    if (!validate(theme)) { console.warn('Theme', 'Not a theme', theme); return }
    console.log('Theme', `Load theme, background: ${theme.background}.`)
    this.el.innerHTML = `:root { --background: ${theme.background}; --f_high: ${theme.f_high}; --f_med: ${theme.f_med}; --f_low: ${theme.f_low}; --f_inv: ${theme.f_inv}; --b_high: ${theme.b_high}; --b_med: ${theme.b_med}; --b_low: ${theme.b_low}; --b_inv: ${theme.b_inv}; }`
    localStorage.setItem('theme', JSON.stringify(theme))
    this.active = theme
    if (this.callback) {
      this.callback()
    }
  }

  this.reset = function () {
    this.load(_default)
  }

  function parse (any) {
    if (any && any.background) { return any } else if (any && any.data) { return any.data } else if (any && isJson(any)) { return JSON.parse(any) } else if (any && isHtml(any)) { return extract(any) }
    return null
  }

  // Drag

  this.drag = function (e) {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  this.drop = function (e) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (!file || !file.name) { console.warn('Theme', 'Unnamed file.'); return }
    if (file.name.indexOf('.thm') < 0 && file.name.indexOf('.svg') < 0) { console.warn('Theme', 'Skipped, not a theme'); return }
    const reader = new FileReader()
    reader.onload = function (e) {
      themer.load(e.target.result)
    }
    reader.readAsText(file)
  }

  this.open = function () {
    const fs = require('fs')
    const { dialog, app } = require('electron').remote
    let paths = dialog.showOpenDialog(app.win, { properties: ['openFile'], filters: [{ name: 'Themes', extensions: ['svg'] }] })
    if (!paths) { console.log('Nothing to load'); return }
    fs.readFile(paths[0], 'utf8', function (err, data) {
      if (err) throw err
      themer.load(data)
    })
  }

  window.addEventListener('dragover', this.drag)
  window.addEventListener('drop', this.drop)

  // Helpers

  function validate (json) {
    if (!json) { return false }
    if (!json.background) { return false }
    if (!json.f_high) { return false }
    if (!json.f_med) { return false }
    if (!json.f_low) { return false }
    if (!json.f_inv) { return false }
    if (!json.b_high) { return false }
    if (!json.b_med) { return false }
    if (!json.b_low) { return false }
    if (!json.b_inv) { return false }
    return true
  }

  function extract (text) {
    const svg = new DOMParser().parseFromString(text, 'text/xml')
    try {
      return {
        'background': svg.getElementById('background').getAttribute('fill'),
        'f_high': svg.getElementById('f_high').getAttribute('fill'),
        'f_med': svg.getElementById('f_med').getAttribute('fill'),
        'f_low': svg.getElementById('f_low').getAttribute('fill'),
        'f_inv': svg.getElementById('f_inv').getAttribute('fill'),
        'b_high': svg.getElementById('b_high').getAttribute('fill'),
        'b_med': svg.getElementById('b_med').getAttribute('fill'),
        'b_low': svg.getElementById('b_low').getAttribute('fill'),
        'b_inv': svg.getElementById('b_inv').getAttribute('fill')
      }
    } catch (err) {
      console.warn('Theme', 'Incomplete SVG Theme', err)
    }
  }

  function isJson (text) {
    try { JSON.parse(text); return true } catch (error) { return false }
  }

  function isHtml (text) {
    try { new DOMParser().parseFromString(text, 'text/xml'); return true } catch (error) { return false }
  }
}
