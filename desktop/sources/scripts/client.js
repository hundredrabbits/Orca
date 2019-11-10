'use strict'

/* global library */
/* global Acels */
/* global Source */
/* global History */
/* global Orca */
/* global IO */
/* global Cursor */
/* global Commander */
/* global Clock */
/* global Theme */

function Client () {
  this.version = 149
  this.library = library

  this.theme = new Theme(this)
  this.acels = new Acels(this)
  this.source = new Source(this)
  this.history = new History(this)

  this.orca = new Orca(this.library)
  this.io = new IO(this)
  this.cursor = new Cursor(this)
  this.commander = new Commander(this)
  this.clock = new Clock(this)

  // Settings
  this.grid = { w: 8, h: 8 }
  this.tile = {
    w: +localStorage.getItem('tilew') || 10,
    h: +localStorage.getItem('tileh') || 15
  }
  this.scale = window.devicePixelRatio
  this.hardmode = true
  this.guide = false

  this.el = document.createElement('canvas')
  this.context = this.el.getContext('2d')

  this.install = (host) => {
    host.appendChild(this.el)
    this.theme.install(host)

    this.theme.default = { background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' }

    this.acels.set('File', 'New', 'CmdOrCtrl+N', () => { this.reset() })
    this.acels.set('File', 'Open', 'CmdOrCtrl+O', () => { this.source.open('orca', this.whenOpen) })
    this.acels.set('File', 'Load Modules', 'CmdOrCtrl+L', () => { this.source.load('orca') })
    this.acels.set('File', 'Load Images', 'CmdOrCtrl+Shift+L', () => { this.source.load('jpg') })
    this.acels.set('File', 'Save', 'CmdOrCtrl+S', () => { this.source.write('orca', 'orca', `${this.orca}`, 'text/plain') })

    this.acels.add('Edit', 'cut')
    this.acels.add('Edit', 'copy')
    this.acels.add('Edit', 'paste')

    this.acels.set('Edit', 'Select All', 'CmdOrCtrl+A', () => { this.cursor.selectAll() })
    this.acels.set('Edit', 'Erase Selection', 'Backspace', () => { this[this.commander.isActive ? 'commander' : 'cursor'].erase() })
    this.acels.set('Edit', 'Undo', 'CmdOrCtrl+Z', () => { this.history.undo() })
    this.acels.set('Edit', 'Redo', 'CmdOrCtrl+Shift+Z', () => { this.history.redo() })

    this.acels.set('Project', 'Find', 'CmdOrCtrl+J', () => { this.commander.start('find:') })
    this.acels.set('Project', 'Inject', 'CmdOrCtrl+B', () => { this.commander.start('inject:') })
    this.acels.set('Project', 'Toggle Commander', 'CmdOrCtrl+K', () => { this.commander.start() })
    this.acels.set('Project', 'Run Commander', 'Enter', () => { this.commander.run() })

    this.acels.set('Cursor', 'Toggle Insert Mode', 'CmdOrCtrl+I', () => { this.cursor.toggleMode(1) })
    this.acels.set('Cursor', 'Toggle Block Comment', 'CmdOrCtrl+/', () => { this.cursor.comment() })
    this.acels.set('Cursor', 'Trigger Operator', 'CmdOrCtrl+P', () => { this.cursor.trigger() })
    this.acels.set('Cursor', 'Reset', 'Escape', () => { this.toggleGuide(false); this.commander.stop(); this.clear(); this.isPaused = false; this.cursor.reset() })

    this.acels.set('Move', 'Move North', 'ArrowUp', () => { this.cursor.move(0, 1) })
    this.acels.set('Move', 'Move East', 'ArrowRight', () => { this.cursor.move(1, 0) })
    this.acels.set('Move', 'Move South', 'ArrowDown', () => { this.cursor.move(0, -1) })
    this.acels.set('Move', 'Move West', 'ArrowLeft', () => { this.cursor.move(-1, 0) })
    this.acels.set('Move', 'Scale North', 'Shift+ArrowUp', () => { this.cursor.scale(0, 1) })
    this.acels.set('Move', 'Scale East', 'Shift+ArrowRight', () => { this.cursor.scale(1, 0) })
    this.acels.set('Move', 'Scale South', 'Shift+ArrowDown', () => { this.cursor.scale(0, -1) })
    this.acels.set('Move', 'Scale West', 'Shift+ArrowLeft', () => { this.cursor.scale(-1, 0) })
    this.acels.set('Move', 'Drag North', 'Alt+ArrowUp', () => { this.cursor.drag(0, 1) })
    this.acels.set('Move', 'Drag East', 'Alt+ArrowRight', () => { this.cursor.drag(1, 0) })
    this.acels.set('Move', 'Drag South', 'Alt+ArrowDown', () => { this.cursor.drag(0, -1) })
    this.acels.set('Move', 'Drag West', 'Alt+ArrowLeft', () => { this.cursor.drag(-1, 0) })
    this.acels.set('Move', 'Move North(Leap)', 'CmdOrCtrl+ArrowUp', () => { this.cursor.move(0, this.grid.h) })
    this.acels.set('Move', 'Move East(Leap)', 'CmdOrCtrl+ArrowRight', () => { this.cursor.move(this.grid.w, 0) })
    this.acels.set('Move', 'Move South(Leap)', 'CmdOrCtrl+ArrowDown', () => { this.cursor.move(0, -this.grid.h) })
    this.acels.set('Move', 'Move West(Leap)', 'CmdOrCtrl+ArrowLeft', () => { this.cursor.move(-this.grid.w, 0) })
    this.acels.set('Move', 'Scale North(Leap)', 'CmdOrCtrl+Shift+ArrowUp', () => { this.cursor.scale(0, this.grid.h) })
    this.acels.set('Move', 'Scale East(Leap)', 'CmdOrCtrl+Shift+ArrowRight', () => { this.cursor.scale(this.grid.w, 0) })
    this.acels.set('Move', 'Scale South(Leap)', 'CmdOrCtrl+Shift+ArrowDown', () => { this.cursor.scale(0, -this.grid.h) })
    this.acels.set('Move', 'Scale West(Leap)', 'CmdOrCtrl+Shift+ArrowLeft', () => { this.cursor.scale(-this.grid.w, 0) })
    this.acels.set('Move', 'Drag North(Leap)', 'CmdOrCtrl+Alt+ArrowUp', () => { this.cursor.drag(0, this.grid.h) })
    this.acels.set('Move', 'Drag East(Leap)', 'CmdOrCtrl+Alt+ArrowRight', () => { this.cursor.drag(this.grid.w, 0) })
    this.acels.set('Move', 'Drag South(Leap)', 'CmdOrCtrl+Alt+ArrowDown', () => { this.cursor.drag(0, -this.grid.h) })
    this.acels.set('Move', 'Drag West(Leap)', 'CmdOrCtrl+Alt+ArrowLeft', () => { this.cursor.drag(-this.grid.w, 0) })

    this.acels.set('Clock', 'Play/Pause', 'Space', () => { this.clock.togglePlay() })
    this.acels.set('Clock', 'Frame By Frame', 'CmdOrCtrl+F', () => { this.clock.touch() })
    this.acels.set('Clock', 'Reset Frame', 'CmdOrCtrl+Shift+R', () => { this.clock.setFrame(0) })
    this.acels.set('Clock', 'Incr. Speed', 'Shift+>', () => { this.clock.modSpeed(1) })
    this.acels.set('Clock', 'Decr. Speed', 'Shift+<', () => { this.clock.modSpeed(-1) })
    this.acels.set('Clock', 'Incr. Speed(10x)', 'CmdOrCtrl+>', () => { this.clock.modSpeed(10, true) })
    this.acels.set('Clock', 'Decr. Speed(10x)', 'CmdOrCtrl+<', () => { this.clock.modSpeed(-10, true) })

    this.acels.set('View', 'Toggle Retina', '`', () => { this.toggleRetina() })
    this.acels.set('View', 'Toggle Hardmode', 'Tab', () => { this.toggleHardmode() })
    this.acels.set('View', 'Toggle Guide', 'CmdOrCtrl+G', () => { this.toggleGuide() })
    this.acels.set('View', 'Incr. Col', ']', () => { this.modGrid(1, 0) })
    this.acels.set('View', 'Decr. Col', '[', () => { this.modGrid(-1, 0) })
    this.acels.set('View', 'Incr. Row', '}', () => { this.modGrid(0, 1) })
    this.acels.set('View', 'Decr. Row', '{', () => { this.modGrid(0, -1) })
    this.acels.set('View', 'Zoom In', 'CmdOrCtrl+=', () => { this.modZoom(0.0625) })
    this.acels.set('View', 'Zoom Out', 'CmdOrCtrl+-', () => { this.modZoom(-0.0625) })
    this.acels.set('View', 'Zoom Reset', 'CmdOrCtrl+0', () => { this.modZoom(1, true) })

    this.acels.set('Midi', 'Play/Pause Midi', 'Shift+Space', () => { this.clock.togglePlay(true) })
    this.acels.set('Midi', 'Next Input Device', 'CmdOrCtrl+}', () => { this.io.midi.selectNextInput() })
    this.acels.set('Midi', 'Next Output Device', 'CmdOrCtrl+]', () => { this.io.midi.selectNextOutput() })
    this.acels.set('Midi', 'Refresh Devices', 'CmdOrCtrl+Shift+M', () => { this.io.midi.refresh() })

    this.acels.set('Communication', 'Choose OSC Port', 'alt+O', () => { this.commander.start('osc:') })
    this.acels.set('Communication', 'Choose UDP Port', 'alt+U', () => { this.commander.start('udp:') })

    this.acels.install(window)
    this.acels.pipe(this.commander)
  }

  this.start = () => {
    console.info('Client', 'Starting..')
    console.info(`${this.acels}`)
    this.theme.start()
    this.io.start()
    this.history.bind(this.orca, 's')
    this.history.record(this.orca.s)
    this.clock.start()
    this.cursor.start()

    this.reset()
    this.resize()
    this.update()
    this.el.className = 'ready'

    this.toggleGuide()
  }

  this.reset = () => {
    this.orca.reset()
    this.resize()
    this.source.new()
    this.history.reset()
    this.cursor.reset()
    this.clock.play()
  }

  this.run = () => {
    this.io.clear()
    this.clock.run()
    this.orca.run()
    this.io.run()
    this.update()
  }

  this.update = () => {
    if (document.hidden === true) { return }
    this.clear()
    this.ports = this.findPorts()
    this.drawProgram()
    this.drawInterface()
    this.drawGuide()
  }

  this.whenOpen = (file, text) => {
    const lines = text.trim().split('\n')
    const w = lines[0].length
    const h = lines.length
    const s = lines.join('\n').trim()

    this.orca.load(w, h, s)
    this.history.reset()
    this.history.record(this.orca.s)
    this.resize()
  }

  this.setGrid = (w, h) => {
    this.grid.w = w
    this.grid.h = h
    this.update()
  }

  this.toggleRetina = () => {
    this.scale = this.scale === 1 ? window.devicePixelRatio : 1
    console.log('Client', `Pixel resolution: ${this.scale}`)
    this.resize(true)
  }

  this.toggleHardmode = () => {
    this.hardmode = this.hardmode !== true
    console.log('Client', `Hardmode: ${this.hardmode}`)
    this.update()
  }

  this.toggleGuide = (force = null) => {
    const display = force !== null ? force : this.guide !== true
    if (display === this.guide) { return }
    console.log('Client', `Toggle Guide: ${display}`)
    this.guide = display
    this.update()
  }

  this.modGrid = (x = 0, y = 0) => {
    const w = clamp(this.grid.w + x, 4, 16)
    const h = clamp(this.grid.h + y, 4, 16)
    this.setGrid(w, h)
  }

  this.modZoom = (mod = 0, reset = false) => {
    this.tile = {
      w: reset ? 10 : this.tile.w * (mod + 1),
      h: reset ? 15 : this.tile.h * (mod + 1)
    }
    localStorage.setItem('tilew', this.tile.w)
    localStorage.setItem('tileh', this.tile.h)
    this.resize(true)
  }

  //

  this.isCursor = (x, y) => {
    return x === this.cursor.x && y === this.cursor.y
  }

  this.isMarker = (x, y) => {
    return x % this.grid.w === 0 && y % this.grid.h === 0
  }

  this.isNear = (x, y) => {
    return x > (parseInt(this.cursor.x / this.grid.w) * this.grid.w) - 1 && x <= ((1 + parseInt(this.cursor.x / this.grid.w)) * this.grid.w) && y > (parseInt(this.cursor.y / this.grid.h) * this.grid.h) - 1 && y <= ((1 + parseInt(this.cursor.y / this.grid.h)) * this.grid.h)
  }

  this.isAligned = (x, y) => {
    return x === this.cursor.x || y === this.cursor.y
  }

  this.isEdge = (x, y) => {
    return x === 0 || y === 0 || x === this.orca.w - 1 || y === this.orca.h - 1
  }

  this.isLocals = (x, y) => {
    return this.isNear(x, y) === true && (x % (this.grid.w / 4) === 0 && y % (this.grid.h / 4) === 0) === true
  }

  this.portAt = (x, y) => {
    return this.ports[this.orca.indexAt(x, y)]
  }

  this.findPorts = () => {
    const a = new Array((this.orca.w * this.orca.h) - 1)
    for (const operator of this.orca.runtime) {
      if (this.orca.lockAt(operator.x, operator.y)) { continue }
      const ports = operator.getPorts()
      for (const port of ports) {
        const index = this.orca.indexAt(port[0], port[1])
        a[index] = port
      }
    }
    return a
  }

  // Interface

  this.makeGlyph = (x, y) => {
    const g = this.orca.glyphAt(x, y)
    if (g !== '.') { return g }
    if (this.isCursor(x, y)) { return this.isPaused ? '~' : '@' }
    if (this.isMarker(x, y)) { return '+' }
    return g
  }

  this.makeStyle = (x, y, glyph, selection) => {
    const isLocked = this.orca.lockAt(x, y)
    const port = this.ports[this.orca.indexAt(x, y)]
    if (this.cursor.selected(x, y)) { return 4 }
    if (!port && glyph === '.' && isLocked === false && this.hardmode === true) { return this.isLocals(x, y) === true ? 9 : 7 }
    if (selection === glyph && isLocked === false && selection !== '.') { return 6 }
    if (glyph === '*' && isLocked === false) { return 6 }
    if (port) { return port[2] }
    if (isLocked === true) { return 5 }
    return 9
  }

  this.makeTheme = (type) => {
    // Operator
    if (type === 0) { return { bg: this.theme.active.b_med, fg: this.theme.active.f_low } }
    // Haste
    if (type === 1) { return { fg: this.theme.active.b_med } }
    // Input
    if (type === 2) { return { fg: this.theme.active.b_high } }
    // Output
    if (type === 3) { return { bg: this.theme.active.b_high, fg: this.theme.active.f_low } }
    // Selected
    if (type === 4) { return { bg: this.theme.active.b_inv, fg: this.theme.active.f_inv } }
    // Locked
    if (type === 5) { return { fg: this.theme.active.f_med } }
    // Reader
    if (type === 6) { return { fg: this.theme.active.b_inv } }
    // Invisible
    if (type === 7) { return {} }
    // Reader
    if (type === 8) { return { bg: this.theme.active.b_low, fg: this.theme.active.f_high } }
    // Reader+Background
    if (type === 10) { return { bg: this.theme.active.background, fg: this.theme.active.f_high } }
    // Default
    return { fg: this.theme.active.f_low }
  }

  // Canvas

  this.clear = () => {
    this.context.clearRect(0, 0, this.el.width, this.el.height)
  }

  this.drawProgram = () => {
    const selection = this.cursor.read()
    for (let y = 0; y < this.orca.h; y++) {
      for (let x = 0; x < this.orca.w; x++) {
        const glyph = this.makeGlyph(x, y)
        const style = this.makeStyle(x, y, glyph, selection)
        this.drawSprite(x, y, glyph, style)
      }
    }
  }

  this.drawInterface = () => {
    this.write(this.orca.f < 15 ? `ver${this.version}` : `${this.cursor.inspect()}`, this.grid.w * 0, this.orca.h, this.grid.w)
    this.write(`${this.cursor.x},${this.cursor.y}${this.cursor.mode === 1 ? '+' : ''}`, this.grid.w * 1, this.orca.h, this.grid.w, this.cursor.mode === 1 ? 1 : 2)
    this.write(`${this.cursor.w}:${this.cursor.h}`, this.grid.w * 2, this.orca.h, this.grid.w)
    this.write(`${this.orca.f}f${this.isPaused ? '*' : ''}`, this.grid.w * 3, this.orca.h, this.grid.w)
    this.write(`${this.io.inspect(this.grid.w)}`, this.grid.w * 4, this.orca.h, this.grid.w)
    this.write(`${display(Object.keys(this.orca.variables).join(''), this.orca.f, this.grid.w)}`, this.grid.w * 5, this.orca.h, this.grid.w)

    if (this.commander.isActive === true) {
      this.write(`${this.commander.query}${this.orca.f % 2 === 0 ? '_' : ''}`, this.grid.w * 0, this.orca.h + 1, this.grid.w * 4)
    } else {
      this.write(`${Object.keys(this.source.cache).length} modules`, this.grid.w * 0, this.orca.h + 1, this.grid.w)
      this.write(`${this.orca.w}x${this.orca.h}`, this.grid.w * 1, this.orca.h + 1, this.grid.w)
      this.write(`${this.grid.w}/${this.grid.h}${this.tile.w !== 10 ? ' ' + (this.tile.w / 10).toFixed(1) : ''}`, this.grid.w * 2, this.orca.h + 1, this.grid.w)
      this.write(`${this.clock}`, this.grid.w * 3, this.orca.h + 1, this.grid.w, this.clock.isPuppet === true ? 3 : 2)
      this.write(`${this.io.midi}`, this.grid.w * 4, this.orca.h + 1, this.grid.w * 4)
    }
  }

  this.drawGuide = () => {
    if (this.guide !== true) { return }
    const operators = Object.keys(this.library).filter((val) => { return isNaN(val) })
    for (const id in operators) {
      const key = operators[id]
      const oper = new this.library[key]()
      const text = oper.info
      const frame = this.orca.h - 4
      const x = (Math.floor(parseInt(id) / frame) * 32) + 2
      const y = (parseInt(id) % frame) + 2
      this.write(key, x, y, 99, 3)
      this.write(text, x + 2, y, 99, 10)
    }
  }

  this.drawSprite = (x, y, g, type) => {
    const theme = this.makeTheme(type)
    if (theme.bg) {
      const bgrect = { x: x * this.tile.w * this.scale, y: (y) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
      this.context.fillStyle = theme.bg
      this.context.fillRect(bgrect.x, bgrect.y, bgrect.w, bgrect.h)
    }
    if (theme.fg) {
      const fgrect = { x: (x + 0.5) * this.tile.w * this.scale, y: (y + 1) * this.tile.h * this.scale, w: this.tile.w * this.scale, h: this.tile.h * this.scale }
      this.context.fillStyle = theme.fg
      this.context.fillText(g, fgrect.x, fgrect.y)
    }
  }

  this.write = (text, offsetX, offsetY, limit = 50, type = 2) => {
    let x = 0
    while (x < text.length && x < limit - 1) {
      this.drawSprite(offsetX + x, offsetY, text.substr(x, 1), type)
      x += 1
    }
  }

  // Resize tools

  this.resize = () => {
    const pad = 30
    const size = { w: window.innerWidth - (pad * 2), h: window.innerHeight - ((pad * 2) + this.tile.h * 2) }
    const tiles = { w: Math.ceil(size.w / this.tile.w), h: Math.ceil(size.h / this.tile.h) }
    const bounds = this.orca.bounds()

    // Clamp at limits of orca file
    if (tiles.w < bounds.w + 1) { tiles.w = bounds.w + 1 }
    if (tiles.h < bounds.h + 1) { tiles.h = bounds.h + 1 }

    this.crop(tiles.w, tiles.h)

    // Keep cursor in bounds
    if (this.cursor.x >= tiles.w) { this.cursor.moveTo(tiles.w - 1, this.cursor.y) }
    if (this.cursor.y >= tiles.h) { this.cursor.moveTo(this.cursor.x, tiles.h - 1) }

    const w = this.tile.w * this.orca.w * this.scale
    const h = (this.tile.h + (this.tile.h / 5)) * this.orca.h * this.scale

    if (w === this.el.width && h === this.el.height) { return }

    console.log(`Resized to: ${this.orca.w}x${this.orca.h}`)

    this.el.width = w
    this.el.height = h
    this.el.style.width = `${Math.ceil(this.tile.w * this.orca.w)}px`
    this.el.style.height = `${Math.ceil((this.tile.h + (this.tile.h / 5)) * this.orca.h)}px`

    this.context.textBaseline = 'bottom'
    this.context.textAlign = 'center'
    this.context.font = `${this.tile.h * 0.75 * this.scale}px input_mono_medium`
    this.update()
  }

  this.crop = (w, h) => {
    let block = `${this.orca}`

    if (h > this.orca.h) {
      block = `${block}${`\n${'.'.repeat(this.orca.w)}`.repeat((h - this.orca.h))}`
    } else if (h < this.orca.h) {
      block = `${block}`.split('\n').slice(0, (h - this.orca.h)).join('\n').trim()
    }

    if (w > this.orca.w) {
      block = `${block}`.split('\n').map((val) => { return val + ('.').repeat((w - this.orca.w)) }).join('\n').trim()
    } else if (w < this.orca.w) {
      block = `${block}`.split('\n').map((val) => { return val.substr(0, val.length + (w - this.orca.w)) }).join('\n').trim()
    }

    this.history.reset()
    this.orca.load(w, h, block, this.orca.f)
  }

  // Docs

  this.docs = () => {
    let html = ''
    const operators = Object.keys(library).filter((val) => { return isNaN(val) })
    for (const id in operators) {
      const oper = new this.library[operators[id]]()
      const ports = oper.ports.input ? Object.keys(oper.ports.input).reduce((acc, key, val) => { return acc + ' ' + key }, '') : ''
      html += `- \`${oper.glyph.toUpperCase()}\` **${oper.name}**${ports !== '' ? '(' + ports.trim() + ')' : ''}: ${oper.info}.\n`
    }
    return html
  }
  // Events

  window.addEventListener('dragover', (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  })

  window.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file.name.indexOf('.orca') > -1) {
      this.toggleGuide(false)
      this.source.read(file, this.whenOpen)
    }
  })

  window.onresize = (event) => {
    this.resize()
  }

  // Helpers

  function display (str, f, max) { return str.length < max ? str : str.slice(f % str.length) + str.substr(0, f % str.length) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
