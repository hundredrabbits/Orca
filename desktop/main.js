const { app, BrowserWindow, webFrame, Menu } = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell

let is_shown = true

app.win = null

app.on('ready', () => {
  app.win = new BrowserWindow({
    width: 710,
    height: 450,
    minWidth: 320,
    minHeight: 320,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    resizable: true,
    autoHideMenuBar: true,
    icon: __dirname + '/icon.ico'
  })

  app.win.loadURL(`file://${__dirname}/sources/index.html`)
  // app.inspect()

  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide', function () {
    is_shown = false
  })

  app.win.on('show', function () {
    is_shown = true
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    }
  })
})

app.inspect = function () {
  app.win.toggleDevTools()
}

app.toggle_fullscreen = function () {
  app.win.setFullScreen(!app.win.isFullScreen())
}

app.toggle_visible = function () {
  if (process.platform === 'win32') {
    if (!app.win.isMinimized()) { app.win.minimize() } else { app.win.restore() }
  } else {
    if (is_shown && !app.win.isFullScreen()) { app.win.hide() } else { app.win.show() }
  }
}

app.inject_menu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  } catch (err) {
    console.warn('Cannot inject menu.')
  }
}
