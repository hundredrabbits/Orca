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

  this.ins = false

  this.start = () => {
    document.onmousedown = this.onMouseDown
    document.onmouseup = this.onMouseUp
    document.onmousemove = this.onMouseMove
    document.oncopy = this.onCopy
    document.oncut = this.onCut
    document.onpaste = this.onPaste
    document.oncontextmenu = this.onContextMenu
  }

  this.select = (x = this.x, y = this.y, w = this.w, h = this.h) => {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) { return }
    this.x = clamp(parseInt(x), 0, client.orca.w - 1)
    this.y = clamp(parseInt(y), 0, client.orca.h - 1)
    this.w = clamp(parseInt(w), -this.x, client.orca.w - 1)
    this.h = clamp(parseInt(h), -this.y, client.orca.h - 1)

    this.calculateBounds()
    client.toggleGuide(false)
    client.update()
  }

  this.selectAll = () => {
    this.select(0, 0, client.orca.w, client.orca.h)
    this.ins = false
  }

  this.move = (x, y) => {
    this.select(this.x + parseInt(x), this.y - parseInt(y))
  }

  this.moveTo = (x, y) => {
    this.select(x, y)
  }

  this.scale = (w, h) => {
    this.select(this.x, this.y, this.w + parseInt(w), this.h - parseInt(h))
  }

  this.scaleTo = (w, h) => {
    this.select(this.x, this.y, w, h)
  }

  this.drag = (x, y) => {
    if (isNaN(x) || isNaN(y)) { return }
    this.ins = false
    const block = this.getBlock()
    this.erase()
    this.move(x, y)
    this.writeBlock(block)
  }

  this.reset = (pos = false) => {
    this.select(pos ? 0 : this.x, pos ? 0 : this.y, 0, 0)
    this.ins = 0
  }

  this.read = function () {
    return client.orca.glyphAt(this.x, this.y)
  }

  this.write = (g) => {
    if (!client.orca.isAllowed(g)) { return }
    if (client.orca.write(this.x, this.y, g) && this.ins) {
      this.move(1, 0)
    }
    client.history.record(client.orca.s)
  }

  this.erase = () => {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        client.orca.write(x, y, '.')
      }
    }
    client.history.record(client.orca.s)
  }

  this.find = (str) => {
    const i = client.orca.s.indexOf(str)
    if (i < 0) { return }
    const pos = client.orca.posAt(i)
    this.select(pos.x, pos.y, str.length - 1, 0)
  }

  this.trigger = () => {
    const operator = client.orca.operatorAt(this.x, this.y)
    if (!operator) { console.warn('Cursor', 'Nothing to trigger.'); return }
    console.log('Cursor', 'Trigger: ' + operator.name)
    operator.run(true)
  }

  this.inspect = () => {
    if (this.w !== 0 || this.h !== 0) { return 'multi' }
    const index = client.orca.indexAt(this.x, this.y)
    const port = client.ports[index]
    if (port) { return `${port[3]}` }
    if (client.orca.lockAt(this.x, this.y)) { return 'locked' }
    return 'empty'
  }

  this.comment = () => {
    const block = this.getBlock()
    for (const val of block) {
      val[0] = val[0] === '#' ? '.' : '#'
      val[val.length - 1] = val[val.length - 1] === '#' ? '.' : '#'
    }
    this.writeBlock(block)
  }

  // Block

  this.getBlock = () => {
    const rect = this.toRect()
    return client.orca.getBlock(rect.x, rect.y, rect.w, rect.h)
  }

  this.writeBlock = (block, overlap = false) => {
    client.orca.writeBlock(this.x, this.y, block, overlap)
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
    const pos = this.mousePick(e.clientX, e.clientY)
    this.select(pos.x, pos.y, 0, 0)
    this.mouseFrom = pos
  }

  this.onMouseMove = (e) => {
    if (!this.mouseFrom) { return }
    const pos = this.mousePick(e.clientX, e.clientY)
    this.select(this.mouseFrom.x, this.mouseFrom.y, pos.x - this.mouseFrom.x, pos.y - this.mouseFrom.y)
  }

  this.onMouseUp = (e) => {
    if (this.mouseFrom) {
      const pos = this.mousePick(e.clientX, e.clientY)
      this.select(this.mouseFrom.x, this.mouseFrom.y, pos.x - this.mouseFrom.x, pos.y - this.mouseFrom.y)
    }
    this.mouseFrom = null
  }

  this.mousePick = (x, y, w = client.tile.w, h = client.tile.h) => {
    return { x: parseInt((x - 30) / w), y: parseInt((y - 30) / h) }
  }

  this.onContextMenu = (e) => {
    e.preventDefault()
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
    this.writeBlock(data.split(/\r?\n/), this.ins)
    this.scaleTo(data.split('\n')[0].length - 1, data.split('\n').length - 1)
    e.preventDefault()
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
