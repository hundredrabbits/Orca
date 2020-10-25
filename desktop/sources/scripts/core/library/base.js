`use strict`

/* global Operator */
/* global library */

library.base = {}

for (let i = 0; i <= 9; i++) {
    library.base[`${i}`] = function OperatorNull (orca, x, y, passive) {
      Operator.call(this, orca, x, y, '.', false)

      this.name = 'null'
      this.info = 'empty'

      // Overwrite run, to disable draw.
      this.run = function (force = false) {

      }
    }
}