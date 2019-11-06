'use strict'

/* global localStorage */
/* global FileReader */
/* global DOMParser */

function Theme () {
  this.el = document.createElement('style')
  this.el.type = 'text/css'

  this.active = {}
  this.default = {
    background: '#eee',
    f_high: '#000',
    f_med: '#999',
    f_low: '#ccc',
    f_inv: '#000',
    b_high: '#000',
    b_med: '#888',
    b_low: '#aaa',
    b_inv: '#ffb545'
  }

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
        console.log('Theme', 'Loading localStorage..')
        this.load(storage)
        return
      }
    }
    this.load(this.default)
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
  }

  this.reset = () => {
    this.load(this.default)
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
    if (!file || !file.name) { console.warn('Theme', 'Could not read file.'); return }
    if (file.name.indexOf('.svg') < 0) { console.warn('Theme', 'Not a SVG file.'); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      this.load(e.target.result)
    }
    reader.readAsText(file)
    e.stopPropagation()
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

  function isJson (text) {
    try { JSON.parse(text); return true } catch (error) { return false }
  }

  function isHtml (text) {
    try { new DOMParser().parseFromString(text, 'text/xml'); return true } catch (error) { return false }
  }
}
