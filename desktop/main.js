'use strict'

/* global createWindow */

const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

let isShown = true

app.win = null

// Replacement for npm start --disable-gpu if necessary
// app.disableHardwareAcceleration()

app.on('ready', () => {
  app.win = new BrowserWindow({
    width: 780,
    height: 462,
    minWidth: 380,
    minHeight: 360,
    backgroundColor: '#000',
    icon: path.join(__dirname, { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico'),
    resizable: true,
    frame: process.platform !== 'darwin',
    skipTaskbar: process.platform === 'darwin',
    autoHideMenuBar: process.platform === 'darwin',
    webPreferences: {
      zoomFactor: 1.0,
      nodeIntegration: true,
      backgroundThrottling: false,
    },
    fullscreen: true
  })

  app.win.loadURL(`file://${__dirname}/sources/index.html`)
  // app.inspect()

  app.win.on('closed', () => {
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

app.toggleMenubar = function () {
  app.win.setMenuBarVisibility(!app.win.isMenuBarVisible())
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
