'use strict'

function Keyboard (orca, terminal) {
  this.locks = []
  this.history = ''
  this.mode = 0

  this.toggleMode = function () {
    this.mode = this.mode === 0 ? 1 : 0
  }

  this.onKeyDown = function (event) {
    // Reset
    if ((event.metaKey || event.ctrlKey) && event.key === 'Backspace') {
      terminal.reset()
      event.preventDefault()
      return
    }

    if (event.key === 'c' && (event.metaKey || event.ctrlKey)) { terminal.cursor.copy(); event.preventDefault(); return }
    if (event.key === 'x' && (event.metaKey || event.ctrlKey)) { terminal.cursor.cut(); event.preventDefault(); return }
    if (event.key === 'v' && (event.metaKey || event.ctrlKey)) { terminal.cursor.paste(); event.preventDefault(); return }
    if (event.key === 'a' && (event.metaKey || event.ctrlKey)) { terminal.cursor.selectAll(); event.preventDefault(); return }

    // Undo/Redo
    if (event.key === 'z' && (event.metaKey || event.ctrlKey) && event.shiftKey) { terminal.history.redo(); event.preventDefault(); return }
    if (event.key === 'z' && (event.metaKey || event.ctrlKey)) { terminal.history.undo(); event.preventDefault(); return }

    if (event.keyCode === 38) { terminal.keyboard.onArrowUp(event.shiftKey, (event.metaKey || event.ctrlKey)); return }
    if (event.keyCode === 40) { terminal.keyboard.onArrowDown(event.shiftKey, (event.metaKey || event.ctrlKey)); return }
    if (event.keyCode === 37) { terminal.keyboard.onArrowLeft(event.shiftKey, (event.metaKey || event.ctrlKey)); return }
    if (event.keyCode === 39) { terminal.keyboard.onArrowRight(event.shiftKey, (event.metaKey || event.ctrlKey)); return }

    if (event.metaKey) { return }
    if (event.ctrlKey) { return }

    if (event.key === 'Enter') { terminal.cursor.toggleMode(); return }
    if (event.key === 'Backspace') { terminal.cursor.erase(); return }
    if (event.key === ' ') { terminal.pause(); event.preventDefault(); return }
    if (event.key === 'Escape') { terminal.clear(); terminal.isPaused = false; terminal.cursor.reset(); return }

    if (event.key === ']') { terminal.modGrid(1, 0); event.preventDefault(); return }
    if (event.key === '[') { terminal.modGrid(-1, 0); event.preventDefault(); return }
    if (event.key === '}') { terminal.modGrid(0, 1); event.preventDefault(); return }
    if (event.key === '{') { terminal.modGrid(0, -1); event.preventDefault(); return }
    if (event.key === '>') { terminal.modSpeed(1); event.preventDefault(); return }
    if (event.key === '<') { terminal.modSpeed(-1); event.preventDefault(); return }

    if (event.key.length === 1) {
      // Send key
      if (this.mode === 1 && event.key !== '/') {
        terminal.io.sendKey(event.key)
        event.preventDefault()
        return
      } else {
        terminal.cursor.write(event.key)
      }
      terminal.update()
    }
  }

  this.onKeyUp = function (event) {
    terminal.update()
  }

  this.onArrowUp = function (mod = false, skip = false) {
    const leap = skip ? terminal.size.grid.h : 1
    if (mod) {
      terminal.cursor.scale(0, leap)
    } else {
      terminal.cursor.move(0, leap)
    }
  }

  this.onArrowDown = function (mod = false, skip = false) {
    const leap = skip ? terminal.size.grid.h : 1
    if (mod) {
      terminal.cursor.scale(0, -leap)
    } else {
      terminal.cursor.move(0, -leap)
    }
  }

  this.onArrowLeft = function (mod = false, skip = false) {
    const leap = skip ? terminal.size.grid.w : 1
    if (mod) {
      terminal.cursor.scale(-leap, 0)
    } else {
      terminal.cursor.move(-leap, 0)
    }
  }

  this.onArrowRight = function (mod = false, skip = false) {
    const leap = skip ? terminal.size.grid.w : 1
    if (mod) {
      terminal.cursor.scale(leap, 0)
    } else {
      terminal.cursor.move(leap, 0)
    }
  }

  document.onkeydown = (event) => { this.onKeyDown(event) }
  document.onkeyup = (event) => { this.onKeyUp(event) }
}

module.exports = Keyboard
