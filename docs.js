const lib = require('./desktop/core/lib')

const types = {}

console.log("## Functions")
for(const type in lib){
  if(type === "num"){ continue; }
  console.log(`\n### ${type} functions\n`)
  for(const id in lib[type]){
    const fn = new lib[type][id]()
    if(fn.type === 'misc'){ continue; }
    if(type !== 'queries'){
      if(!types[fn.type]){types[fn.type] = []}
      types[fn.type].push(fn)  
    }
    console.log(`- \`${id.toUpperCase()}\`, **${fn.name}**${fn.type !== 'misc' ? `(${fn.type})` : ''}: ${fn.info}`)
  }
}

console.log("\n### Functions(By Type)\n")
for(const id in types){
  if(id === 'misc'){ continue; }
  console.log(`- **${id}s**: ${types[id].reduce((acc,val) => { return `${acc}\`${val.glyph}\` `},"").trim()}.`)
}
console.log("\n")