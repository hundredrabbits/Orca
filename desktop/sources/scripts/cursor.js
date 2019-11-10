'use strict'

function Cursor (client) {
  this.x = 0
  this.y = 0
  this.w = 0
  this.h = 0

  this.minX = 0
  this.maxX = 0
  this.minY = 0
  this.maxY = 0

  this.mode = 0

  this.start = () => {
    document.onmousedown = (e) => { this.onMouseDown(e) }
    document.onmouseup = (e) => { this.onMouseUp(e) }
    document.onmousemove = (e) => { this.onMouseMove(e) }
    document.oncopy = (e) => { this.onCopy(e) }
    document.oncut = (e) => { this.onCut(e) }
    document.onpaste = (e) => { this.onPaste(e) }
    document.oncontextmenu = (e) => { this.onContextMenu(e) }
  }

  this.move = function (x, y) {
    if (isNaN(x) || isNaN(y)) { return }
    this.x = clamp(this.x + parseInt(x), 0, client.orca.w - 1)
    this.y = clamp(this.y - parseInt(y), 0, client.orca.h - 1)

    this.calculateBounds()
    client.toggleGuide(false)
    client.update()
  }

  this.moveTo = function (x, y) {
    if (isNaN(x) || isNaN(y)) { return }
    this.x = clamp(parseInt(x), 0, client.orca.w - 1)
    this.y = clamp(parseInt(y), 0, client.orca.h - 1)

    this.calculateBounds()
    client.toggleGuide(false)
    client.update()
  }

  this.scale = function (x, y) {
    if (isNaN(x) || isNaN(y)) { return }
    this.w = clamp(this.w + parseInt(x), -this.x, client.orca.w - this.x)
    this.h = clamp(this.h - parseInt(y), -this.y, client.orca.h - this.y)

    this.calculateBounds()
    client.update()
  }

  this.scaleTo = function (w, h) {
    if (isNaN(w) || isNaN(h)) { return }
    this.w = clamp(parseInt(w), -this.x, client.orca.w - 1)
    this.h = clamp(parseInt(h), -this.y, client.orca.h - 1)

    this.calculateBounds()
    client.update()
  }

  this.resize = function (w, h) {
    if (isNaN(w) || isNaN(h)) { return }
    this.w = clamp(parseInt(w), -this.x, client.orca.w - this.x)
    this.h = clamp(parseInt(h), -this.y, client.orca.h - this.y)

    this.calculateBounds()
    client.update()
  }

  this.drag = function (x, y) {
    if (isNaN(x) || isNaN(y)) { return }
    this.mode = 0
    const block = this.getBlock()
    this.erase()
    this.move(x, y)
    this.writeBlock(block)
  }

  this.selectAll = function () {
    this.x = 0
    this.y = 0
    this.w = client.orca.w
    this.h = client.orca.h
    this.mode = 0

    this.calculateBounds()
    client.update()
  }

  this.select = function (x = this.x, y = this.y, w = this.w, h = this.h) {
    this.moveTo(x, y)
    this.scaleTo(w, h)

    this.calculateBounds()
    client.update()
  }

  this.reset = function (pos = false) {
    if (pos) {
      this.x = 0
      this.y = 0
    }
    this.move(0, 0)
    this.w = 0
    this.h = 0
    this.calculateBounds()
    this.mode = 0
  }

  this.copy = function () {
    document.execCommand('copy')
  }

  this.cut = function () {
    document.execCommand('cut')
  }

  this.paste = function (overlap = false) {
    document.execCommand('paste')
  }

  this.read = function () {
    return client.orca.glyphAt(this.x, this.y)
  }

  this.write = function (g) {
    if (!client.orca.isAllowed(g)) { return }
    if (client.orca.write(this.x, this.y, g) && this.mode === 1) {
      this.move(1, 0)
    }
    client.history.record(client.orca.s)
  }

  this.erase = function () {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        client.orca.write(x, y, '.')
      }
    }

    client.history.record(client.orca.s)
  }

  this.rotate = function (rate = 1) {
    if (isNaN(rate)) { return }
    const cols = client.cursor.getBlock()
    for (const y in cols) {
      for (const x in cols[y]) {
        const g = cols[y][x]
        if (g === '.') { continue }
        if (client.orca.isSpecial(g)) { continue }
        cols[y][x] = client.orca.keyOf(parseInt(rate) + client.orca.valueOf(g), sense(g))
      }
    }
    client.cursor.writeBlock(cols)
  }

  this.find = (str) => {
    const i = client.orca.s.indexOf(str)
    if (i < 0) { return }
    const pos = client.orca.posAt(i)
    this.select(pos.x, pos.y, str.length - 1, 0)
    client.update()
  }

  this.trigger = function () {
    const operator = client.orca.operatorAt(this.x, this.y)
    if (!operator) { console.warn('Cursor', 'Nothing to trigger.'); return }
    console.log('Cursor', 'Trigger: ' + operator.name)
    operator.run(true)
  }

  this.toggleMode = function (val) {
    this.w = 0
    this.h = 0
    this.mode = this.mode === 0 ? val : 0
  }

  this.inspect = function (name = true, ports = false) {
    if (this.w !== 0 || this.h !== 0) { return 'multi' }
    const port = client.portAt(this.x, this.y)
    if (port) { return `${port[3]}` }
    if (client.orca.lockAt(this.x, this.y)) { return 'locked' }
    return 'empty'
  }

  this.comment = function () {
    const block = this.getBlock()
    for (const val of block) {
      val[0] = val[0] === '#' ? '.' : '#'
      val[val.length - 1] = val[val.length - 1] === '#' ? '.' : '#'
    }
    this.writeBlock(block)
  }

  // Block

  this.getBlock = function () {
    const rect = this.toRect()
    const block = []
    for (let _y = rect.y; _y < rect.y + rect.h; _y++) {
      const line = []
      for (let _x = rect.x; _x < rect.x + rect.w; _x++) {
        line.push(client.orca.glyphAt(_x, _y))
      }
      block.push(line)
    }
    return block
  }

  this.writeBlock = function (block, overlap = false) {
    if (!block || block.length === 0) { return }
    const rect = this.toRect()
    let _y = rect.y
    for (const line of block) {
      let _x = rect.x
      for (const y in line) {
        const glyph = line[y]
        client.orca.write(_x, _y, overlap === true && glyph === '.' ? client.orca.glyphAt(_x, _y) : glyph)
        _x++
      }
      _y++
    }
    client.history.record(client.orca.s)
  }

  this.toRect = function () {
    return {
      x: this.minX,
      y: this.minY,
      w: this.maxX - this.minX + 1,
      h: this.maxY - this.minY + 1
    }
  }

  this.calculateBounds = function () {
    this.minX = this.x < this.x + this.w ? this.x : this.x + this.w
    this.minY = this.y < this.y + this.h ? this.y : this.y + this.h
    this.maxX = this.x > this.x + this.w ? this.x : this.x + this.w
    this.maxY = this.y > this.y + this.h ? this.y : this.y + this.h
  }

  this.selected = function (x, y) {
    return (
      x >= this.minX &&
      x <= this.maxX &&
      y >= this.minY &&
      y <= this.maxY
    )
  }

  this.mouseFrom = null

  this.onMouseDown = (e) => {
    if (e.button !== 0) { this.cut(); return }
    const pos = this.tilePos(e.clientX, e.clientY)
    this.select(pos.x, pos.y, 0, 0)
    this.mouseFrom = pos
  }

  this.onMouseUp = (e) => {
    if (this.mouseFrom) {
      const pos = this.tilePos(e.clientX, e.clientY)
      this.select(this.mouseFrom.x, this.mouseFrom.y, pos.x - this.mouseFrom.x, pos.y - this.mouseFrom.y)
    }
    this.mouseFrom = null
  }

  this.onMouseMove = (e) => {
    if (!this.mouseFrom) { return }
    const pos = this.tilePos(e.clientX, e.clientY)
    this.select(this.mouseFrom.x, this.mouseFrom.y, pos.x - this.mouseFrom.x, pos.y - this.mouseFrom.y)
  }

  this.onContextMenu = (e) => {
    e.preventDefault()
  }

  this.onCopy = (e) => {
    const block = this.getBlock()
    var rows = []
    for (var i = 0; i < block.length; i++) {
      rows.push(block[i].join(''))
    }
    const content = rows.join('\n').trim()
    e.clipboardData.setData('text/plain', content)
    e.preventDefault()
  }

  this.onCut = (e) => {
    this.onCopy(e)
    this.erase()
  }

  this.onPaste = (e) => {
    const data = e.clipboardData.getData('text/plain').trim()
    this.writeBlock(data.split(/\r?\n/), false)
    this.scaleTo(data.split('\n')[0].length - 1, data.split('\n').length - 1)
    e.preventDefault()
  }

  this.tilePos = (x, y, w = client.tile.w, h = client.tile.h) => {
    return { x: parseInt((x - 30) / w), y: parseInt((y - 30) / h) }
  }

  function sense (s) { return s === s.toUpperCase() && s.toLowerCase() !== s.toUpperCase() }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
