'use strict'

function Renderer(terminal){

  this.el = document.createElement('canvas')
  this.context = this.el.getContext('2d')

  // Settings
  this.grid = { w: 8, h: 8 }
  this.tile = { w: 10, h: 15 }
  this.scale = window.devicePixelRatio

  this.install = function(host){
    host.appendChild(this.el)
  }

  this.start = function(){
    this.el.className = 'ready'
  }

  this.update = function(){
    this.clear()
    this.drawProgram()
    this.drawInterface()
  }

  this.clear = function () {
    this.context.clearRect(0, 0, this.el.width, this.el.height)
  }

  this.guide = function (x, y) {
    const g = terminal.orca.glyphAt(x, y)
    if (g !== '.') { return g }
    if (terminal.isCursor(x, y)) { return this.isPaused ? '~' : '@' }
    if (x % this.grid.w === 0 && y % this.grid.h === 0) { return '+' }
    return g
  }

  this.drawProgram = function () {
    const selection = terminal.cursor.read()
    for (let y = 0; y < terminal.orca.h; y++) {
      for (let x = 0; x < terminal.orca.w; x++) {
        const port = terminal.ports[terminal.orca.indexAt(x, y)]
        const glyph = this.guide(x, y)
        const style = terminal.isSelection(x, y) ? 4 : port ? port[2] : terminal.orca.lockAt(x, y) ? 5 : null
        const likeCursor = glyph === selection && glyph !== '.' && style !== 4 && !terminal.orca.lockAt(x, y)
        this.drawSprite(x, y, glyph, likeCursor ? 6 : style)
      }
    }
  }

  this.drawInterface = function () {
    const col = this.grid.w
    // Cursor
    this.write(`${terminal.cursor.x},${terminal.cursor.y}${terminal.cursor.mode === 1 ? '+' : ''}`, col * 0, 1, this.grid.w, terminal.cursor.mode === 1 ? 1 : 2)
    this.write(`${terminal.cursor.w}:${terminal.cursor.h}`, col * 1, 1, this.grid.w)
    this.write(`${terminal.cursor.inspect()}`, col * 2, 1, this.grid.w)
    this.write(`${terminal.orca.f}f${this.isPaused ? '*' : ''}`, col * 3, 1, this.grid.w)
    this.write(`${terminal.orca.inspect(this.grid.w)}`, col * 4, 1, this.grid.w)

    // Grid
    this.write(`${terminal.orca.w}x${terminal.orca.h}`, col * 0, 0, this.grid.w)
    this.write(`${this.grid.w}/${this.grid.h}`, col * 1, 0, this.grid.w)
    this.write(`${terminal.source}`, col * 2, 0, this.grid.w)
    this.write(`${terminal.clock}`, col * 3, 0, this.grid.w, terminal.io.midi.inputIndex > -1 ? 1 : 2)
    this.write(`${terminal.io.inspect(this.grid.w)}`, col * 4, 0, this.grid.w)

    if (terminal.orca.f < 25) {
      this.write(`${terminal.io.midi}`, col * 5, 0, this.grid.w * 2)
    }

    if (terminal.commander.isActive === true) {
      this.write(`${terminal.commander.query}${terminal.orca.f % 2 === 0 ? '_' : ''}`, col * 5, 1, this.grid.w * 2, 1)
    }
  }

  this.drawSprite = function (x, y, g, type) {
    const style = this.drawStyle(type)
    if (style.bg) {
      const bgrect = { x: x * this.tile.w * this.scale, y: (y) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
      this.context.fillStyle = style.bg
      this.context.fillRect(bgrect.x, bgrect.y, bgrect.w, bgrect.h)
    }
    if (style.fg) {
      const fgrect = { x: (x + 0.5) * this.tile.w * this.scale, y: (y + 1) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
      this.context.fillStyle = style.fg
      this.context.fillText(g, fgrect.x, fgrect.y)
    }
  }

  this.drawStyle = function (type) {
    // Operator
    if (type === 0) { return { bg: terminal.theme.active.b_med, fg: terminal.theme.active.f_low } }
    // Haste
    if (type === 1) { return { fg: terminal.theme.active.b_med } }
    // Input
    if (type === 2) { return { fg: terminal.theme.active.b_high } }
    // Output
    if (type === 3) { return { bg: terminal.theme.active.b_high, fg: terminal.theme.active.f_low } }
    // Selected
    if (type === 4) { return { bg: terminal.theme.active.b_inv, fg: terminal.theme.active.f_inv } }
    // Locked
    if (type === 5) { return { fg: terminal.theme.active.f_med } }
    // LikeCursor
    if (type === 6) { return { fg: terminal.theme.active.b_inv } }
    // Default
    return { fg: terminal.theme.active.f_low }
  }

  this.write = function (text, offsetX, offsetY, limit, type = 2) {
    let x = 0
    while (x < text.length && x < limit - 1) {
      this.drawSprite(offsetX + x, terminal.orca.h + offsetY, text.substr(x, 1), type)
      x += 1
    }
  }

  this.resize = function (force = false) {
    const size = { w: window.innerWidth - 60, h: window.innerHeight - 90 }
    const tiles = { w: Math.floor(size.w / this.tile.w), h: Math.floor(size.h / this.tile.h) }

    if (terminal.orca.w === tiles.w && terminal.orca.h === tiles.h && force === false) { return }

    // Limit Tiles to Bounds
    const bounds = terminal.orca.bounds()
    if (tiles.w <= bounds.w) { tiles.w = bounds.w + 1 }
    if (tiles.h <= bounds.h) { tiles.h = bounds.h + 1 }
    terminal.crop(tiles.w, tiles.h)

    // Keep cursor in bounds
    if (terminal.cursor.x >= tiles.w) { terminal.cursor.x = tiles.w - 1 }
    if (terminal.cursor.y >= tiles.h) { terminal.cursor.y = tiles.h - 1 }

    console.log(`Resize to: ${tiles.w}x${tiles.h}`)

    this.el.width = this.tile.w * terminal.orca.w * this.scale
    this.el.height = (this.tile.h + 3) * terminal.orca.h * this.scale
    this.el.style.width = `${parseInt(this.tile.w * terminal.orca.w)}px`
    this.el.style.height = `${parseInt((this.tile.h + 3) * terminal.orca.h)}px`

    this.context.textBaseline = 'bottom'
    this.context.textAlign = 'center'
    this.context.font = `${this.tile.h * 0.75 * this.scale}px input_mono_medium`

    terminal.update()
  }

}

module.exports = Renderer