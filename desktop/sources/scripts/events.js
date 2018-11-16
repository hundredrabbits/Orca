'use strict'

window.addEventListener('dragover', function (e) {
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
})

window.addEventListener('drop', function (e) {
  e.preventDefault()
  e.stopPropagation()

  const file = e.dataTransfer.files[0]
  const path = file.path ? file.path : file.name

  if (!path || path.indexOf('.pico') < 0) { console.log('Pico', 'Not a pico file'); return }

  terminal.source.path = path
  terminal.source.read(path)
})

window.onresize = (event) => {
  const marginTop = (window.innerHeight - (terminal.size.height * terminal.size.ratio)) / 2
  terminal.el.style.marginTop = (marginTop - 20) + 'px'
}
