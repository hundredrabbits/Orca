const osc = require('node-osc')

const server1 = new osc.Server(12000, '127.0.0.1')
server1.on('message', (msg, rinfo) => {
    console.log(`127:0.0.1:1200 received ${msg}`)
})

const server2 = new osc.Server(3333, '127.0.0.1')
server2.on('message', (msg, rinfo) => {
    console.log(`127:0.0.1:3333 received ${msg}`)
})