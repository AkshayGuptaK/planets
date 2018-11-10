// setup canvas
var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
var width = canvas.width = window.innerWidth
var height = canvas.height = window.innerHeight

// Math helper functions
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
var dataTable = document.querySelector('table')
var addBtn = document.querySelector('#add')
var tableBody = document.querySelector('tbody')
var inputRow = document.querySelector('.input')

var distanceIndex = document.getElementById("distance").cellIndex
var sizeIndex = document.getElementById("size").cellIndex
var periodIndex = document.getElementById("period").cellIndex
var colorIndex = document.getElementById("color").cellIndex

function getInputData () {
  let data = []
  for (let i=0; i<inputRow.children.length-1;i++) {
    data.push(inputRow.children[i].children[0].value)
  }
  return data
}

function addPlanet () {
  let data = getInputData()
  let newRow = document.createElement('tr')
  let newHead = document.createElement('th')
  newHead.scope = 'row'
  newHead.innerHTML = data[0]
  newRow.appendChild(newHead)
  let newCell
  for (let i=1; i<data.length; i++) {
    newCell = document.createElement('td')
    newCell.innerHTML = data[i]
    newRow.appendChild(newCell)
  }
  tableBody.insertBefore(newRow, inputRow)

  let planet = new Planet(
    40*Math.log(data[distanceIndex]),
    random(0, 2*Math.PI),
    Math.log(data[sizeIndex]),
    data[periodIndex],
    data[colorIndex]
  )
  planets.push(planet)
}

function getColumnData (index) {
  let arr = []
  for (let i=1; i<10; i++) { // change imax to number of table rows
    let row = dataTable.rows.item(i).cells
    arr.push(row[index].innerHTML)
  }
  return arr
}

function getNumColumnData (index, func) {
  let arr = []
  for (let i=1; i<10; i++) { // change imax to number of table rows
    let row = dataTable.rows.item(i).cells
    arr.push(func(parseFloat(row[index].innerHTML)))
    }
  return arr
}

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
  let sizes = getNumColumnData(sizeIndex, Math.log)
  let distances = getNumColumnData(distanceIndex, x => 40*Math.log(x))
  let periods = getNumColumnData(periodIndex, x => parseFloat(x))
  let colors = getColumnData(colorIndex)
  
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  drawSun()
  let planet
  for (let i=0; i < 9; i++) {
    planet = new Planet(
      distances[i],
      random(0, 2*Math.PI),
      sizes[i],
      periods[i],
      colors[i]
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