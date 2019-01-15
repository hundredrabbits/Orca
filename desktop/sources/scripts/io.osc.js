'use strict'

const osc = require('node-osc')
const fs = require('fs')

function Osc (terminal) {
  this.stack = []

  this.start = function () {
    console.info('Starting OSC..')
    this.setup()
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
    const args = data.split('.').filter(d => d !== '')
    if (args.length !== 0) {
      const key = args[0]
      const def = this.config.defs[key] || key
      const pattern = def.pattern || ''

      if (pattern.length !== args.length - 1) {
        console.warn(`Number of arguments provided does not match the pattern length of this def`)
        return
      }

      const msg = new osc.Message(def.path || `/${key}`)
      for (let i = 0, l = pattern.length; i < l; i++) {
        const type = pattern[i]

        switch (type) {
          case 'f':
            msg.append({ type, value: parseInt(args[i + 1]) / 10.0 })
            break
          case 'i':
            msg.append(parseInt(args[i + 1]))
            break
          case 's': msg.append(args[i + 1])
            break
          default:
            console.warn(`Don't know how to send OSC argument with type '${type}'`)
            return
        }
      }
      
      const address = def.address || this.config.address
      const port = def.port || this.config.port
      console.log(`Sending ${data} as ${pattern} on ${def.path || `/${key}`}, via ${address}:${port}`)

      this.clients[`${address}:${port}`].send(msg, (err) => {
        if (err) { console.log(err) }
        console.log(`Sent ${data} as ${pattern} on ${def.path || `/${key}`}, via ${address}:${port}`)
      })
    }
  }

  this.createClients = function () {
    for (const key in this.config.defs) {
      const def = this.config.defs[key]
      const address = def.address || this.config.address
      const port = def.port || this.config.port
      if (!this.clients[`${address}:${port}`]) {
        this.clients[`${address}:${port}`] = new osc.Client(address, port)
        console.log(`OSC client ${address}:${port} created`)
      }
    }
  }

  this.setup = function () {
    const configPath = '../../core/bridge/oscConfig'
    this.config = require(configPath)
    this.clients = {}
    this.createClients()
    
    // fs.watch('./core/bridge/oscConfig', (event, filename) => {
    //   if (filename) {
    //     console.log(`${filename} file Changed`)
    //     for (const client in this.clients) {
    //       this.clients[client].kill()
    //     }
    //     this.createClients()
    //   }
    // })
  }
}

module.exports = Osc
