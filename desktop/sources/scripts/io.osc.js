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
      this.play(this.stack[id], this.route())
    }
  }

  this.send = function (msg) {
    this.stack.push(msg)
  }

  this.update = function () {
    terminal.controller.clearCat('default', 'OSC Bridge')
    for (const id in terminal.io.osc.routes) {
      terminal.controller.add('default', 'OSC Bridge', `${this.routes[id].name} ${this.index === parseInt(id) ? ' — Active' : ''}`, () => { terminal.io.osc.select(id) }, '')
    }
    terminal.controller.commit()
  }

  this.play = function (data, route) {
    console.log(`Sending ${data}, via ${route.name}`)

    if (route.protocol === 'udp') {
      this.port.send(Buffer.from(`${data}`), route.port, route.remoteAddress, (err) => {
        if (err) { console.log(err) }
      })
    } else if (route.protocol === 'osc') {
      const split = data.split('.').filter(d => d !== '')
      console.log(split)
      if (split.length === 2) {
        const key = split[0]
        const definition = route[key]
        const address = definition.path
        const type = definition.type
        if (type !== 'f' && type !== 'i' && type !== 's') {
          console.log(`Don't know how to send OSC argument with type '${type}'`)
          return
        }
        const value =
            type === 'f' ? parseInt(split[1]) / 10.0
              : type === 'i' ? parseInt(split[1])
              /* type === 's' ? */ : split[1]

        function nextMultipleOf4 (x) {
          const rem = x % 4
          return rem === 0 ? x : (x + 4 - rem)
        }

        function writeOscString (val, buf, pos) {
          var localPos = pos
          for (var i = 0; i < val.length; i++) {
            const ch = val.charCodeAt(i)
            localPos = buf.writeUInt8(ch & 0xFF, localPos)
          }
          // Add length, terminating 0 and pad to multiple of 4
          return nextMultipleOf4(pos + val.length + 1)
        }

        var msglen = 0
        { // Calculate message length
          // Zero-terminated address string
          msglen += nextMultipleOf4(address.length + 1)
          // Type tag with two args arg: comma, letter (key), letter (value), terminating 0
          msglen += 4
          // Zero-terminated key string
          msglen += nextMultipleOf4(key.length + 1)
          if (type === 'f' || type === 'i') {
            // 32-bit float or int
            msglen += 4
          } else if (type === 's') {
            // Zero terminated value string
            msglen += nextMultipleOf4(value.length + 1)
          }
        }

        // Get buffer cleared to 0
        const buf = Buffer.alloc(msglen)
        var pos = 0

        pos = writeOscString(address, buf, pos)
        pos = writeOscString(`,s${type}`, buf, pos)
        pos = writeOscString(key, buf, pos)

        if (type === 'f') {
          pos = buf.writeFloatBE(value, pos)
        } else if (type === 'i') {
          pos = buf.writeInt32BE(value, pos)
        } else if (type === 's') {
          pos = writeOscString(value, buf, pos)
        }

        this.port.send(buf, route.port, route.remoteAddress, (err) => {
          if (err) { console.log(err) }
        })
      }
    }
  }

  this.createPort = function (route) {
    if (route.protocol === 'udp') {
      const dgram = require('dgram')
      return dgram.createSocket('udp4')
    }

    if (route.protocol === 'osc') {
      const osc = require('node-osc')
      return new osc.Client(route.remoteAddress, route.port)
    }
  }

  this.select = function (id) {
    if (!this.routes[id]) { return }
    this.index = parseInt(id)
    console.info(`Bridge Route: ${this.route().name}`)

    this.port = this.createPort(this.route())

    this.update()
  }

  this.route = function () {
    return this.routes[this.index]
  }

  this.setup = function () {
    this.routes = [
      require('../../core/bridge/default'),
      require('../../core/bridge/tidal'),
      require('../../core/bridge/sonicpi')
    ]
    terminal.io.osc.select(0)
  }
}

module.exports = Osc
