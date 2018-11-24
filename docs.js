const lib = require('./desktop/core/library')

console.log("## Functions")
for(const type in lib){
  if(type === "num"){ continue; }
  console.log(`\n### ${type} functions\n`)
  for(const id in lib[type]){
    const fn = new lib[type][id]()
    console.log(`- ${fn.docs()}`)
  }
}

console.log("\n")