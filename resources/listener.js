const IP_ADDR = '127.0.0.1'
const UDP_PORT = 49161
const OSC_PORT = 49162

const dgram = require('dgram')
const udpserver = dgram.createSocket('udp4')

const osc = require('./desktop/node_modules/node-osc')
const oscserver = new osc.Server(OSC_PORT, IP_ADDR)

console.log(`Started Listener\n\nUDP:${UDP_PORT}\nOSC:${OSC_PORT}\n`)

// Error

udpserver.on('error', (err) => {
  console.log(`UDP server:\n${err.stack}`)
  udpserver.close()
})

oscserver.on('error', (err) => {
  console.log(`OSC server:\n${err.stack}`)
  oscserver.close()
})

// Message

udpserver.on('message', (msg, rinfo) => {
  console.log(`UDP server: ${msg} from ${rinfo.address}:${rinfo.port}`)
})

oscserver.on('message', (msg, rinfo) => {
  console.log(`OSC server: ${msg} from ${rinfo.address}:${rinfo.port} at ${msg[0]}`)
})

udpserver.bind(UDP_PORT)

// Send a run message to orca

udpserver.send('run', 0, 3, 49160, IP_ADDR)
