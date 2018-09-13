const {app, BrowserWindow, webFrame, Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell;

let win

let is_shown = true;

app.win = null;

app.on('ready', () => 
{
  app.win = new BrowserWindow({
    width: 510, 
    height: 510, 
    minWidth:510, 
    minHeight:510, 
    frame:false, 
    autoHideMenuBar: true,
    backgroundColor: '#000000', 
    resizable:true, 
    autoHideMenuBar: true,
    icon: __dirname + '/icon.ico'
  })

  app.win.loadURL(`file://${__dirname}/sources/index.html`);
  // app.win.toggleDevTools();

  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide',function() {
    is_shown = false;
  })

  app.win.on('show',function() {
    is_shown = true;
  })

  app.on('window-all-closed', () => 
  {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    }
  })
})

app.inspect = function()
{
  app.win.toggleDevTools();
}

app.toggle_fullscreen = function()
{
  app.win.setFullScreen(app.win.isFullScreen() ? false : true);
}

app.toggle_visible = function()
{
  if(is_shown){ app.win.hide(); } else{ app.win.show(); }
}

app.inject_menu = function(m)
{
  try{
    Menu.setApplicationMenu(Menu.buildFromTemplate(m));  
  }  
  catch(err){
    console.warn("Cannot inject menu");
  }
}