var raf = require('raf')
var Isomer = require('isomer') 
var Color = require('color')
var perlin = require('perlin-noise');


// duration of loop / speed of animation
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

var numRows = 20
var numCols = numRows

var perlin_array = perlin.generatePerlinNoise(numRows, numRows);
var perlin_array_2 =  perlin.generatePerlinNoise(numRows, numRows);


function getRand(min, max) {
  return Math.random() * (max - min) + min;
}

function colorGenerator(p, row, col) {
  var sat = Math.abs((p * perlin_array[row] * 100) % 100);
  var hue = Math.abs(Math.sin(p) * 100 * row * (perlin_array[col] * perlin_array_2[row]));
  var light = Math.sin(p) * 10 + 50;
  var color = Color().hsl(hue, sat, light);

  return color;
}

var rotationZ = getRand(-0.2, 0);

function render (p) {
  ctx.clearRect(0, 0, width, height)
  for (var row = numRows; row >= 1; row--) {
    for(var col = 1; col <= numCols; col++) {
      var w = .5;
      var l = .5;
      var h = .5;

      var x = (row - numRows / 2) * w
      var z = (col - numRows / 2 ) * l
      var y = Math.sin(perlin_array[col] *  perlin_array_2[row] * p * row) + 1

      var pos = Isomer.Point(x, y, z)

      var rx = Math.abs(Math.cos(x + w/2));
      var ry = y + l/1
      var rz = z + h/2

      var cube = Shape.Prism(pos, w, l, h); 

      cube = cube.rotateX(Point(rx, ry, rz), Math.sin( p * perlin_array_2[row]))
      cube = cube.rotateZ(Point(rx, rz, ry), rotationZ * p * perlin_array[col]);

      var color = colorGenerator(p, row, col);
      var isomercolor = new Isomer.Color(color.red(), color.green(), color.blue())
      iso.add(cube, isomercolor)
    }
  }
}

// set up our infinite animation loop + call render with progress each frame
var timeStart = Date.now()
function tick () {
  var elapsed = Date.now() - timeStart
  var p = (Math.sin(elapsed / duration));

  render(p)
  raf(tick)
}

tick()
