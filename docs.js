const lib = require('./desktop/core/library')

console.log("## Functions\n")

for(const id in lib){
  const operator = new lib[id]()
  if(operator.glyph === '.'){ continue; }
  console.log(`- ${operator.docs()}`)
}

console.log("\n")