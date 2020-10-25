`use strict`

/* global Operator */
/* global library */

library.base = {}

library.base['#'] = function OperatorComment (orca, x, y, passive) {
    Operator.call(this, orca, x, y, '#', true)

    this.name = 'comment'
    this.info = 'Halts line'
    this.draw = false

    this.operation = function () {
      for (let x = this.x + 1; x <= orca.w; x++) {
        orca.lock(x, this.y)
        if (orca.glyphAt(x, this.y) === this.glyph) { break }
      }
      orca.lock(this.x, this.y)
    }
}

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