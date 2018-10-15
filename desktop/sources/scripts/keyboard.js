'use strict'

function Keyboard () {
  this.locks = []
  this.history = ''

  this.listen_onkeydown = function (event) {
    // Reset
    if ((event.metaKey || event.ctrlKey) && event.key == 'Backspace') {
      terminal.reset()
      event.preventDefault()
      return
    }
    // Pause
    if ((event.metaKey || event.ctrlKey) && event.key == 'p') {
      terminal.pause()
      event.preventDefault()
      return
    }

    if (event.metaKey) { return }
    if (event.ctrlKey) { return }

    if (event.keyCode == 38) { keyboard.key_arrow_up(); return }
    if (event.keyCode == 40) { keyboard.key_arrow_down(); return }
    if (event.keyCode == 37) { keyboard.key_arrow_left(); return }
    if (event.keyCode == 39) { keyboard.key_arrow_right(); return }

    if (event.key == 'Backspace') { terminal.cursor.insert('.'); return }
    if (event.key == 'Space') { terminal.cursor.insert('.'); event.preventDefault(); return }
    if (event.key == 'Escape') { logo.remove(); terminal.clear(); return }

    if (event.key.length == 1) {
      terminal.cursor.insert(event.key)
      if (event.shiftKey) {
        terminal.cursor.move(1, 0)
      }
      terminal.update()
    }
  }

  this.key_arrow_up = function () {
    terminal.cursor.move(0, 1)
  }

  this.key_arrow_down = function () {
    terminal.cursor.move(0, -1)
  }

  this.key_arrow_left = function () {
    terminal.cursor.move(-1, 0)
  }

  this.key_arrow_right = function () {
    terminal.cursor.move(1, 0)
  }
}
