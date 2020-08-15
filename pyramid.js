var raf = require('raf');
var Isomer = require('isomer');
var ease = require('ease-component');
var Color = require('color');


var duration = 5000

// create a canvas element and add it to the page
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
document.body.appendChild(canvas)

// set canvas width + height to size of window
var width = canvas.width = window.innerWidth
var height = canvas.height = window.innerHeight

// set up isomer
var iso = new Isomer(canvas)
var Point = Isomer.Point
var Shape = Isomer.Shape

var n_rows = 10
var n_cols = n_rows

// This will be called continuously with a p value (between 0 and 1) representing progress through our animation
// e.g. when p == 0.5 we are 50% of the way through
function render (p) {
  ctx.clearRect(0, 0, width, height)
  for (var row = n_rows; row >= 1; row--) {
    for(var col = 1; col <= n_cols; col++) {
      var w = 1
      var l = 1
      var h = .5

      var x = (row - n_rows / 2) * w
      var z = (col - n_rows / 2 ) * l
      var y = 1

      var pos = Isomer.Point(x, y, z)

      var rx = x + w/2 + row
      var ry = y + l/2 + row
      var rz = z + h/2 + row

      var cube = Isomer.Shape.Pyramid(pos, w, l, h).rotateX(Point(rx, ry, rz), Math.PI * p).rotateZ(Point(rx, rz, ry), 3 * Math.PI * p)

      var sat = (p * 0.5 * row * col * 360) % 360
      var color = Color().hsl(sat, 20, 40)
      var isomercolor = new Isomer.Color(color.red(), color.green(), color.blue())
      iso.add(cube, isomercolor)
    }
  }
}

// set up our infinite animation loop + call render with progress each frame
var timeStart = Date.now()
function tick () {
  var elapsed = Date.now() - timeStart
  var p = (elapsed % duration) / duration
  render(p)
  raf(tick)
}

tick()