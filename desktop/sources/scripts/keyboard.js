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

    if (event.key === 'c' && event.metaKey) { terminal.cursor.copy(); return }
    if (event.key === 'v' && event.metaKey) { terminal.cursor.paste(); return }
    if (event.key === 'x' && event.metaKey) { terminal.cursor.cut(); return }

    if (event.keyCode === 38) { keyboard.key_arrow_up(event.shiftKey); return }
    if (event.keyCode === 40) { keyboard.key_arrow_down(event.shiftKey); return }
    if (event.keyCode === 37) { keyboard.key_arrow_left(event.shiftKey); return }
    if (event.keyCode === 39) { keyboard.key_arrow_right(event.shiftKey); return }

    if (event.metaKey) { return }
    if (event.ctrlKey) { return }

    if (event.key === 'Enter') { terminal.cursor.toggleMode(); return }
    if (event.key === 'Backspace') { terminal.cursor.erase(); return }
    if (event.key === ' ') { terminal.pause(); event.preventDefault(); return }
    if (event.key === 'Escape') { terminal.clear(); terminal.isPaused = false; terminal.cursor.reset(); return }

    if (event.key === ']') { terminal.modGrid(1,0); event.preventDefault(); return }
    if (event.key === '[') { terminal.modGrid(-1,0); event.preventDefault(); return }
    if (event.key === '}') { terminal.modGrid(0,1); event.preventDefault(); return }
    if (event.key === '{') { terminal.modGrid(0,-1); event.preventDefault(); return }

    if (event.key.length === 1) {
      terminal.cursor.insert(event.key)
      terminal.update()
    }
  }

  this.key_arrow_up = function (mod = false) {
    if (mod) {
      terminal.cursor.scale(0, 1)
    } else {
      terminal.cursor.move(0, 1)
    }
  }

  this.key_arrow_down = function (mod = false) {
    if (mod) {
      terminal.cursor.scale(0, -1)
    } else {
      terminal.cursor.move(0, -1)
    }
  }

  this.key_arrow_left = function (mod = false) {
    if (mod) {
      terminal.cursor.scale(-1, 0)
    } else {
      terminal.cursor.move(-1, 0)
    }
  }

  this.key_arrow_right = function (mod = false) {
    if (mod) {
      terminal.cursor.scale(1, 0)
    } else {
      terminal.cursor.move(1, 0)
    }
  }
}
