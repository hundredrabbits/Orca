'use strict'

function Program_Default (program, x, y) {
  this.name = '<missing name>'
  this.x = x
  this.y = y
  this.glyph = '.'
  this.ports = []

  this.id = function () {
    return this.x + (this.y * program.h)
  }

  this.run = function () {
    this.operation()
  }

  this.operation = function () {

  }

  this.remove = function () {
    this.replace('.')
  }

  this.replace = function (g) {
    this.lock()
    program.add(this.x, this.y, g)
  }

  this.lock = function () {
    program.lock(this.x, this.y)
  }

  this.move = function (x, y, g) {
    program.lock(this.x + x, this.y + y)
    program.remove(this.x, this.y)
    program.add((this.x + x) % program.w, (this.y + y) % program.h, this.glyph)
  }

  this.is_free = function (x, y) {
    if (this.x + x >= program.w) { return false }
    if (this.x + x <= -1) { return false }
    if (this.y + y >= program.h) { return false }
    if (this.y + y <= -1) { return false }

    const target = program.glyph_at(this.x + x, this.y + y)
    return target == '.' || target == 'b' ? true : target
  }

  this.neighbor_by = function (x, y) {
    return program.glyph_at(this.x + x, this.y + y) != '.' ? { x: this.x + x, y: this.y + y, glyph: program.glyph_at(this.x + x, this.y + y) } : null
  }

  this.neighbors = function (g) {
    return [this.up(g), this.right(g), this.down(g), this.left(g)].filter(function (e) { return e })
  }

  this.free_neighbors = function () {
    const a = []
    if (program.glyph_at(this.x + 1, this.y) == '.') { a.push({ x: this.x + 1, y: this.y }) }
    if (program.glyph_at(this.x - 1, this.y) == '.') { a.push({ x: this.x - 1, y: this.y }) }
    if (program.glyph_at(this.x, this.y + 1) == '.') { a.push({ x: this.x, y: this.y + 1 }) }
    if (program.glyph_at(this.x, this.y - 1) == '.') { a.push({ x: this.x, y: this.y - 1 }) }
    return a
  }

  this.bang = function () {
    const ns = this.neighbors('b')
    for (const id in ns) {
      const n = ns[id]
      if (program.glyph_at(n.x, n.y - 1) != 'h') {
        return { x: n.x, y: n.y }
      }
    }
    return false
  }

  this.left = function (target = null) {
    const g = program.glyph_at(this.x - 1, this.y)

    return g != '.' && (g == target || !target) ? { x: this.x - 1, y: this.y, glyph: g } : null
  }

  this.right = function (target) {
    const g = program.glyph_at(this.x + 1, this.y)
    return g != '.' && (g == target || !target) ? { x: this.x + 1, y: this.y, glyph: g } : null
  }

  this.up = function (target) {
    const g = program.glyph_at(this.x, this.y - 1)
    return g != '.' && (g == target || !target) ? { x: this.x, y: this.y - 1, glyph: g } : null
  }

  this.down = function (target) {
    const g = program.glyph_at(this.x, this.y + 1)
    return g != '.' && (g == target || !target) ? { x: this.x, y: this.y + 1, glyph: g } : null
  }

  this.docs = function () {
    return `${this.name}`
  }
}

module.exports = Program_Default
