`use strict`

/* global Operator */
/* global library */

library.sbz = {
    'z': function OperatorZ (orca, x, y, passive) {
        Operator.call(this, orca, x, y, 'z', passive)

        this.name = 'lerp'
        this.info = 'Transitions operand to target by duration'

        this.ports.stepped = { x: -2, y: 0, default: '0' }
        this.ports.duration = { x: -1, y: 0, default: '8' }
        this.ports.target = { x: 1, y: 0 }
        this.ports.output = { x: 0, y: 1, sensitive: true, reader: true, output: true }

        this.operation = function (force = false) {
          const duration = this.listen(this.ports.duration, true)
          const target = this.listen(this.ports.target, true)
          const val = this.listen(this.ports.output, true)
          var stepped = this.listen(this.ports.stepped, true)
          if (stepped >= duration) {
            stepped = duration
            this.output(stepped, this.ports.stepped)
          }
          if (val !== target) {
            if (stepped === duration) { stepped = 0 }  // previous iteration done, ok to restart
            const steps = duration - stepped
            const remaining = target - val
            const mod = Math.round(remaining / steps)
            this.output(orca.keyOf(val + mod), this.ports.output)
            this.output(orca.keyOf(stepped + 1), this.ports.stepped)
          }
        }
      }
}

