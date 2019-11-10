'use strict'

/* global localStorage */
/* global FileReader */
/* global DOMParser */

function Theme (client) {
  this.el = document.createElement('style')
  this.el.type = 'text/css'

  this.active = {}
  this.default = {
    background: '#eeeeee',
    f_high: '#000000',
    f_med: '#666666',
    f_low: '#888888',
    f_inv: '#000000',
    b_high: '#cccccc',
    b_med: '#dddddd',
    b_low: '#ffffff',
    b_inv: '#ffb545'
  }

  // Callbacks
  this.onLoad = () => {}

  this.install = (host = document.body) => {
    window.addEventListener('dragover', this.drag)
    window.addEventListener('drop', this.drop)
    host.appendChild(this.el)
  }

  this.start = () => {
    console.log('Theme', 'Starting..')
    if (isJson(localStorage.theme)) {
      const storage = JSON.parse(localStorage.theme)
      if (isValid(storage)) {
        console.log('Theme', 'Loading theme in localStorage..')
        this.load(storage)
        return
      }
    }
    this.load(this.default)
  }

  this.open = () => {
    console.log('Theme', 'Open theme..')
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      this.read(e.target.files[0], this.load)
    }
    input.click()
  }

  this.load = (data) => {
    const theme = this.parse(data)
    if (!isValid(theme)) { console.warn('Theme', 'Invalid format'); return }
    console.log('Theme', 'Loaded theme!')
    this.el.innerHTML = `:root { 
      --background: ${theme.background}; 
      --f_high: ${theme.f_high}; 
      --f_med: ${theme.f_med}; 
      --f_low: ${theme.f_low}; 
      --f_inv: ${theme.f_inv}; 
      --b_high: ${theme.b_high}; 
      --b_med: ${theme.b_med}; 
      --b_low: ${theme.b_low}; 
      --b_inv: ${theme.b_inv};
    }`
    localStorage.setItem('theme', JSON.stringify(theme))
    this.active = theme
    if (this.onLoad) {
      this.onLoad(data)
    }
  }

  this.reset = () => {
    this.load(this.default)
  }

  this.set = (key, val) => {
    if (!val) { return }
    const hex = (`${val}`.substr(0, 1) !== '#' ? '#' : '') + `${val}`
    if (!isColor(hex)) { console.warn('Theme', `${hex} is not a valid color.`); return }
    this.active[key] = hex
  }

  this.read = (key) => {
    return this.active[key]
  }

  this.parse = (any) => {
    if (isValid(any)) { return any }
    if (isJson(any)) { return JSON.parse(any) }
    if (isHtml(any)) { return extract(any) }
  }

  // Drag

  this.drag = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  this.drop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file.name.indexOf('.svg') > -1) {
      this.read(file, this.load)
    }
    e.stopPropagation()
  }

  this.read = (file, callback) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      callback(event.target.result)
    }
    reader.readAsText(file, 'UTF-8')
  }

  // Helpers

  function extract (xml) {
    const svg = new DOMParser().parseFromString(xml, 'text/xml')
    try {
      return {
        background: svg.getElementById('background').getAttribute('fill'),
        f_high: svg.getElementById('f_high').getAttribute('fill'),
        f_med: svg.getElementById('f_med').getAttribute('fill'),
        f_low: svg.getElementById('f_low').getAttribute('fill'),
        f_inv: svg.getElementById('f_inv').getAttribute('fill'),
        b_high: svg.getElementById('b_high').getAttribute('fill'),
        b_med: svg.getElementById('b_med').getAttribute('fill'),
        b_low: svg.getElementById('b_low').getAttribute('fill'),
        b_inv: svg.getElementById('b_inv').getAttribute('fill')
      }
    } catch (err) {
      console.warn('Theme', 'Incomplete SVG Theme', err)
    }
  }

  function isValid (json) {
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

  function isColor (hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex)
  }

  function isJson (text) {
    try { JSON.parse(text); return true } catch (error) { return false }
  }

  function isHtml (text) {
    try { new DOMParser().parseFromString(text, 'text/xml'); return true } catch (error) { return false }
  }
}
