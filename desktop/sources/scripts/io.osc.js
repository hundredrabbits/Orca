'use strict'

const osc = require('node-osc')

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
      const def = this.config.defs[key]
      const pattern = def.pattern

      if(pattern.length !== args.length - 1) {
        console.log(`Number of arguments provided does not match the pattern length of this def`)
        return
      }

      const values = []
      for(let i = 0, l = pattern.length; i < l; i++) {
        const type = pattern[i]
        if (type !== 'f' && type !== 'i' && type !== 's') {
          console.log(`Don't know how to send OSC argument with type '${type}'`)
          return
        }

        const value =
          type === 'f' ? parseInt(args[i + 1]) / 10.0 :
          type === 'i' ? parseInt(args[i + 1]) :
          args[i + 1] /* type === 's' */
        
        values.push(value)
      }
      
      console.log(`Sending ${values}, via ${def.address}:${def.port}`)
      this.clients[`${def.address}:${def.port}`].send(def.path, ...values, (err) => {
        if (err) { console.log(err) }
      })
    }
  }

  this.setup = function () {
    this.config = require('../../core/bridge/oscConfig')
    this.clients = {}
    for (const key in this.config.defs) {
      const def = this.config.defs[key]
      const address = def.address
      const port = def.port
      if (!this.clients[`${address}:${port}`]) {
        this.clients[`${address}:${port}`]  = new osc.Client(address, port)
        console.log(`OSC client ${address}:${port} created`)
      }
    }
  }
}

module.exports = Osc
