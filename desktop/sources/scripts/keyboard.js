'use strict'

function Keyboard () {
  this.locks = []
  this.history = ''

  this.listen_onkeydown = function (event) {
    // Reset
    if ((event.metaKey || event.ctrlKey) && event.key === 'Backspace') {
      terminal.reset()
      event.preventDefault()
      return
    }
    // Pause
    if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
      terminal.pause()
      event.preventDefault()
      return
    }

    if (event.key === 'c' && (event.metaKey || event.ctrlKey)) { terminal.cursor.copy(); event.preventDefault(); return }
    if (event.key === 'x' && (event.metaKey || event.ctrlKey)) { terminal.cursor.cut(); event.preventDefault(); return }
    if (event.key === 'v' && (event.metaKey || event.ctrlKey)) { terminal.cursor.paste(); event.preventDefault(); return }
    if (event.key === 'a' && (event.metaKey || event.ctrlKey)) { terminal.cursor.selectAll(); event.preventDefault(); return }

    if (event.keyCode === 38) { keyboard.key_arrow_up(event.shiftKey, (event.metaKey || event.ctrlKey)); return }
    if (event.keyCode === 40) { keyboard.key_arrow_down(event.shiftKey, (event.metaKey || event.ctrlKey)); return }
    if (event.keyCode === 37) { keyboard.key_arrow_left(event.shiftKey, (event.metaKey || event.ctrlKey)); return }
    if (event.keyCode === 39) { keyboard.key_arrow_right(event.shiftKey, (event.metaKey || event.ctrlKey)); return }

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

    if (event.key.length === 1) {
      terminal.cursor.insert(event.key)
      terminal.update()
    }
  }

  this.key_arrow_up = function (mod = false, skip = false) {
    const leap = skip ? terminal.grid.y : 1
    if (mod) {
      terminal.cursor.scale(0, leap)
    } else {
      terminal.cursor.move(0, leap)
    }
  }

  this.key_arrow_down = function (mod = false, skip = false) {
    const leap = skip ? terminal.grid.y : 1
    if (mod) {
      terminal.cursor.scale(0, -leap)
    } else {
      terminal.cursor.move(0, -leap)
    }
  }

  this.key_arrow_left = function (mod = false, skip = false) {
    const leap = skip ? terminal.grid.x : 1
    if (mod) {
      terminal.cursor.scale(-leap, 0)
    } else {
      terminal.cursor.move(-leap, 0)
    }
  }

  this.key_arrow_right = function (mod = false, skip = false) {
    const leap = skip ? terminal.grid.x : 1
    if (mod) {
      terminal.cursor.scale(leap, 0)
    } else {
      terminal.cursor.move(leap, 0)
    }
  }
}
