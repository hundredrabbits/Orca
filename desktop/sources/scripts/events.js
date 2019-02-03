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

  if (!path || path.indexOf('.orca') < 0) { console.log('Orca', 'Not a orca file'); return }

  terminal.source.path = path
  terminal.source.read(path)
})

window.onresize = (event) => {
  terminal.resize()
}
