'use strict'

const dgram = require('dgram')

function Udp (terminal) {
  this.index = 0
  this.stack = []
  this.server = dgram.createSocket('udp4')
  this.listener = dgram.createSocket('udp4')
  this.port = 49160
  this.ip = '127.0.0.1'

  this.start = function () {
    console.info('UDP Starting..')
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (msg) {
    this.stack.push(msg)
  }

  this.play = function (data) {
    this.server.send(Buffer.from(`${data}`), this.port, this.ip, (err) => {
      if (err) { console.log(err) }
    })
  }

  this.select = function (port = 49160) {
    if (port < 1000) { console.warn('Unavailable port'); return }
    this.port = port
    console.log(`UDP Port: ${this.port}`)
    return this.port
  }

  // Input

  this.listener.on('message', (msg, rinfo) => {
    this.act(`${msg}`.toLowerCase())
  })

  this.listener.on('listening', () => {
    const address = this.listener.address()
    console.log(`UDP Listening: ${address.address}:${address.port}`)
  })

  this.listener.on('error', (err) => {
    console.log(`Server error:\n ${err.stack}`)
    this.listener.close()
  })

  this.act = function(msg){
    if(msg === 'play'){
      terminal.play()
    }
    else if(msg === 'stop'){
      terminal.stop()
    }
    else if(msg === 'run'){
      terminal.run()
    }
    else{
      console.warn(`Unknown message: ${msg}`)
    }
  }

  this.listener.bind(49161)
}

module.exports = Udp
