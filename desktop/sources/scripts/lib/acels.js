'use strict'

function Acels (client) {
  this.all = {}
  this.roles = {}
  this.pipe = null

  this.install = (host = window) => {
    host.addEventListener('keydown', this.onKeyDown, false)
    host.addEventListener('keyup', this.onKeyUp, false)
  }

  this.set = (cat, name, accelerator, downfn, upfn) => {
    if (this.all[accelerator]) { console.warn('Acels', `Trying to overwrite ${this.all[accelerator].name}, with ${name}.`) }
    this.all[accelerator] = { cat, name, downfn, upfn, accelerator }
  }

  this.add = (cat, role) => {
    this.all[':' + role] = { cat, name: role, role }
  }

  this.get = (accelerator) => {
    return this.all[accelerator]
  }

  this.sort = () => {
    const h = {}
    for (const item of Object.values(this.all)) {
      if (!h[item.cat]) { h[item.cat] = [] }
      h[item.cat].push(item)
    }
    return h
  }

  this.convert = (event) => {
    const accelerator = event.key === ' ' ? 'Space' : event.key.substr(0, 1).toUpperCase() + event.key.substr(1)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      return `CmdOrCtrl+Shift+${accelerator}`
    }
    if (event.shiftKey) {
      return `Shift+${accelerator}`
    }
    if (event.altKey) {
      return `Alt+${accelerator}`
    }
    if (event.ctrlKey || event.metaKey) {
      return `CmdOrCtrl+${accelerator}`
    }
    return accelerator
  }

  this.pipe = (obj) => {
    this.pipe = obj
  }

  this.onKeyDown = (e) => {
    const target = this.get(this.convert(e))
    if (!target || !target.downfn) { return this.pipe ? this.pipe.onKeyDown(e) : null }
    target.downfn()
    e.preventDefault()
  }

  this.onKeyUp = (e) => {
    const target = this.get(this.convert(e))
    if (!target || !target.upfn) { return this.pipe ? this.pipe.onKeyUp(e) : null }
    target.upfn()
    e.preventDefault()
  }

  this.toMarkdown = () => {
    const cats = this.sort()
    let text = ''
    for (const cat in cats) {
      text += `\n### ${cat}\n\n`
      for (const item of cats[cat]) {
        text += item.accelerator ? `- \`${item.accelerator}\`: ${item.info}\n` : ''
      }
    }
    return text.trim()
  }

  this.toString = () => {
    const cats = this.sort()
    let text = ''
    for (const cat in cats) {
      for (const item of cats[cat]) {
        text += item.accelerator ? `${cat}: ${item.name} | ${item.accelerator}\n` : ''
      }
    }
    return text.trim()
  }

  // Electron specifics

  this.inject = (name = 'Untitled') => {
    const app = require('electron').remote.app
    const injection = []

    injection.push({
      label: name,
      submenu: [
        { label: 'About', click: () => { require('electron').shell.openExternal('https://github.com/hundredrabbits/' + name) } },
        {
          label: 'Theme',
          submenu: [
            { label: 'Download Themes', click: () => { require('electron').shell.openExternal('https://github.com/hundredrabbits/Themes') } },
            { label: 'Open Theme', click: () => { client.theme.open() } },
            { label: 'Reset Theme', click: () => { client.theme.reset() } }
          ]
        },
        { label: 'Fullscreen', accelerator: 'CmdOrCtrl+Enter', click: () => { app.toggleFullscreen() } },
        { label: 'Hide', accelerator: 'CmdOrCtrl+H', click: () => { app.toggleVisible() } },
        { label: 'Toggle Menubar', accelerator: 'Alt+H', click: () => { app.toggleMenubar() } },
        { label: 'Inspect', accelerator: 'CmdOrCtrl+.', click: () => { app.inspect() } },
        { role: 'quit' }
      ]
    })

    const sorted = this.sort()
    for (const cat of Object.keys(sorted)) {
      const submenu = []
      for (const option of sorted[cat]) {
        if (option.role) {
          submenu.push({ role: option.role })
        } else if (option.type) {
          submenu.push({ type: option.type })
        } else {
          submenu.push({ label: option.name, accelerator: option.accelerator, click: option.downfn })
        }
      }
      injection.push({ label: cat, submenu: submenu })
    }
    app.injectMenu(injection)
  }
}
