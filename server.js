console.log("--Orca--\n")

const fs = require('fs')
const path = process.argv[2] ? process.argv[2] : ''
const frames = process.argv[3] ? process.argv[3] : 1000

function run (data,frames) {
  if(!data){ console.log(`Unknown File ${path}`); return }

  const Orca = require('./desktop/core/orca')
  const library = require('./desktop/core/library')
  const orca = new Orca(library)

  const w = data.split('\n')[0].length
  const h = data.split('\n').length

  orca.load(w, h, data)

  console.time('Benchmark')
  console.log(`Running ${path}(${w}x${h}) for ${frames} frames.\n`)

  for(let f = 0; f < frames; f++){
    orca.run()
  }
  
  console.log(`${orca}\n`)
  console.timeEnd('Benchmark')
}

function read (path,frames) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) throw err
    return run(data,frames)
  })
}

read(path,frames)