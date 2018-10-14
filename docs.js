const lib = require('./core/lib')

for(const type in lib){
  console.log(`\n### ${type} functions\n`)
  for(const id in lib[type]){
    const fn = new lib[type][id]()
    console.log(`- \`${id.toUpperCase()}\`, **${fn.name}**: ${fn.info}`)
  }
}
