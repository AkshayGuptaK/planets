// setup canvas

var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

var width = canvas.width = window.innerWidth
var height = canvas.height = window.innerHeight

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min
  return num
}

function PolartoCartesian(r, theta) {
  let x = r * Math.cos(theta)
  let y = r * Math.sin(theta)
  return [x,y]
}

function translateCenter(coords) {
  return [coords[0]+width/2, coords[1]+height/2]
}

// define Planet constructor

function Planet(distance, angle, size, period, color) {
  this.distance = distance
  this.angle = angle
  this.size = size
  this.period = period
  this.color = color
}

// define planet draw method

Planet.prototype.draw = function() {
  ctx.beginPath()
  ctx.fillStyle = this.color
  let coords = translateCenter(PolartoCartesian(this.distance, this.angle))
  ctx.arc(coords[0], coords[1], this.size, 0, 2 * Math.PI) // need to use p2c
  ctx.fill()
}

// define planet update method

Planet.prototype.update = function() {
   this.angle += 2*Math.PI/this.period
}

// define array to store planets and data
var planets = []
var sizes = []
var distances = []
var periods = []
var colors = ['rgb(255,0,0)','rgb(128,0,128)','rgb(0,255,0)','rgb(255,150,0)','rgb(140,70,20)','rgb(128,128,128)','rgb(50,50,255)','rgb(0,0,255)','rgb(255,255,255)']

var dataTable = document.querySelector('table')

function fillDataArray (arr, id, func) {
  for (let i=1; i<10; i++) {
    let row = dataTable.rows.item(i).cells
    for (cell of row) {
      if (cell.className === id) {
        arr.push(func(parseFloat(cell.innerHTML)))
      }
    }
  }
}

fillDataArray(sizes, 'size', Math.log)
fillDataArray(distances, 'distance', x => 40*Math.log(x))
fillDataArray(periods, 'period', x => parseFloat(x))

// define the function to draw the sun
var sun_size = Math.log(1391016)

function drawSun () {
  ctx.beginPath()
  ctx.fillStyle = 'rgb(255,255,0)'
  ctx.arc(width/2, height/2, sun_size, 0, 2 * Math.PI)
  ctx.fill()
}

// define initializing function

function initialize() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  drawSun()

  for (let i=0; i < 9; i++) {
    var planet = new Planet(
      distances[i],
      random(0, 2*Math.PI),
      sizes[i],
      periods[i],
      colors[i],
    )
    planets.push(planet)
  }
}

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  drawSun()

  for(let i = 0; i < planets.length; i++) {
    planets[i].draw()
    planets[i].update()
  }
  requestAnimationFrame(loop)
}

initialize()
loop()