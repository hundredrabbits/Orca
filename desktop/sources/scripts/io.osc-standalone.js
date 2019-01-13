'use strict'

function Osc (terminal) {
  this.index = 0
  this.routes = []
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
    // see io.osc.js
    
    // const args = data.split('.').filter(d => d !== '')
    // if (args.length !== 0) {
    //   const key = args[0]
    //   const def = this.config.defs[key]
    //   const pattern = def.pattern

    //   if(pattern.length !== args.length - 1) {
    //     console.log(`Number of arguments provided does not match the pattern length of this def`)
    //     return
    //   }

    //   const values = []
    //   for(let i = 0, l = pattern.length; i < l; i++) {
    //     const type = pattern[i]
    //     if (type !== 'f' && type !== 'i' && type !== 's') {
    //       console.log(`Don't know how to send OSC argument with type '${type}'`)
    //       return
    //     }

    //     const value =
    //         type === 'f' ? parseInt(split[1]) / 10.0
    //             : type === 'i' ? parseInt(split[1])
    //             /* type === 's' ? */ : split[1]

    //     function nextMultipleOf4 (x) {
    //         const rem = x % 4
    //         return rem === 0 ? x : (x + 4 - rem)
    //     }

    //     function writeOscString (val, buf, pos) {
    //         let localPos = pos
    //         for (let i = 0; i < val.length; i++) {
    //         const ch = val.charCodeAt(i)
    //         localPos = buf.writeUInt8(ch & 0xFF, localPos)
    //         }
    //         // Add length, terminating 0 and pad to multiple of 4
    //         return nextMultipleOf4(pos + val.length + 1)
    //     }

    //     let msglen = 0
    //     { // Calculate message length
    //       // Zero-terminated address string
    //       msglen += nextMultipleOf4(address.length + 1)
    //       // Type tag with two args arg: comma, letter (key), letter (value), terminating 0
    //       msglen += 4
    //       // Zero-terminated key string
    //       msglen += nextMultipleOf4(key.length + 1)
    //       if (type === 'f' || type === 'i') {
    //         // 32-bit float or int
    //         msglen += 4
    //       } else if (type === 's') {
    //         // Zero terminated value string
    //         msglen += nextMultipleOf4(value.length + 1)
    //       }
    //     }

    //     // Get buffer cleared to 0
    //     const buf = Buffer.alloc(msglen)
    //     let pos = 0

    //     pos = writeOscString(address, buf, pos)
    //     pos = writeOscString(`,s${type}`, buf, pos)
    //     pos = writeOscString(key, buf, pos)

    //     if (type === 'f') {
    //       pos = buf.writeFloatBE(value, pos)
    //     } else if (type === 'i') {
    //       pos = buf.writeInt32BE(value, pos)
    //     } else if (type === 's') {
    //       pos = writeOscString(value, buf, pos)
    //     }
    // }

    // this.port.send(buf, def.port, def.address, (err) => {
    //   if (err) { console.log(err) }
    // })
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