'use strict'

const Program_Default = require('./default')

function program_W (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'warp'
  this.glyph = 'w'
  this.ports = [{ x: 0, y: -1 }, { x: 0, y: 1, output: true }, { x: 0, y: 0, bang: true }]

  this.operation = function () {
    const input = this.up()
    const active = this.bang() || this.neighbors('1').length > 0

    if (input && active) {
      const warp = this.find_warp(this)
      if (!warp) { return }
      program.add(warp.x, warp.y + 1, input.glyph)
      program.remove(this.x, this.y - 1)
      program.lock(warp.x, warp.y + 1)
    }
  }

  this.find_warps = function (origin) {
    const a = []
    let y = 0
    while (y < program.h) {
      let x = 0
      while (x < program.w) {
        if (program.glyph_at(x, y) == 'w') {
          a.push({ x: x, y: y })
        }
        x += 1
      }
      y += 1
    }
    return a
  }

  this.find_warp = function (origin) {
    const warps = this.find_warps(origin)

    if (warps.length < 2) { return }

    let warp_id = -1
    for (const id in warps) {
      const warp = warps[id]
      if (warp.x == this.x && warp.y == this.y) {
        warp_id = id
      }
    }
    return warps[(warp_id + 1) % warps.length]
  }
}

module.exports = program_W
