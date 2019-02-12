const { app, BrowserWindow, webFrame, Menu } = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell

let isShown = true

app.win = null

app.on('ready', () => {
  var frameLessMode = process.platform === 'darwin'

  app.win = new BrowserWindow({
    width: 710,
    height: 450,
    minWidth: 320,
    minHeight: 320,
    frame: !frameLessMode,
    resizable: true,
    icon: __dirname + '/icon.ico',
    transparent: frameLessMode,
    skipTaskbar: frameLessMode,
    autoHideMenuBar: frameLessMode
  })

  app.win.loadURL(`file://${__dirname}/sources/index.html`)
  // app.inspect()

  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide', function () {
    isShown = false
  })

  app.win.on('show', function () {
    isShown = true
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    } else {
      app.win.show()
    }
  })
})

app.inspect = function () {
  app.win.toggleDevTools()
}

app.toggleFullscreen = function () {
  app.win.setFullScreen(!app.win.isFullScreen())
}

app.toggleVisible = function () {
  if (process.platform !== 'darwin') {
    if (!app.win.isMinimized()) { app.win.minimize() } else { app.win.restore() }
  } else {
    if (isShown && !app.win.isFullScreen()) { app.win.hide() } else { app.win.show() }
  }
}

app.injectMenu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  } catch (err) {
    console.warn('Cannot inject menu.')
  }
}
