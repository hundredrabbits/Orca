window.addEventListener('dragover', function (e) {
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
})

window.addEventListener('drop', function (e) {
  e.preventDefault()
  e.stopPropagation()

  const file = e.dataTransfer.files[0]
  const name = file.path ? file.path : file.name

  if (!name || name.indexOf('.pico') < 0) { console.log('Pico', 'Not a pico file'); return }

  terminal.load(name)
})
