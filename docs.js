const lib = require('./desktop/core/library')

console.log("## Functions\n")
for(const id in lib){
  const fn = new lib[id]()
  if(fn.glyph === '.'){ continue; }
  console.log(`- ${fn.docs()}`)
}

console.log("\n")