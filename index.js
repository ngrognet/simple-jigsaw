import Puzzle from './components/puzzle.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// set up canvas
canvas.width = 1024
canvas.height = 576
ctx.fillStyle = '#00512C'
ctx.fillRect(0, 0, canvas.width, canvas.height)

let puzzle = null
let activeCluster = null
let nextZindex = 0

const image = new Image()
image.src = "assets/picture.jpeg"
image.onload = function () {
  initializeGame(image)
}

function initializeGame(image) {
  puzzle = new Puzzle({
    image: image,
    widthPixels: image.width,
    heightPixels: image.height,
    widthPieces: 5,
    heightPieces: 5
  })
  puzzle.initialize(canvas)
  clearCanvas()
  puzzle.draw(ctx)

  canvas.addEventListener("mousedown", handleMouseDown)
  canvas.addEventListener("mousemove", handleMouseMove)
  canvas.addEventListener("mouseup", handleMouseUp)
}

function drawBoard() {
  clearCanvas()
  puzzle.draw(ctx)
}

function clearCanvas() {
  ctx.fillStyle = '#0096c7'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function handleMouseDown(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left
  const mouseY = event.clientY - canvas.getBoundingClientRect().top

  const selectedCluster = puzzle.getClickedCluster(mouseX, mouseY)
  if (selectedCluster) {
    selectedCluster.moving = true
    activeCluster = selectedCluster
    nextZindex++
    activeCluster.zindex = nextZindex
    drawBoard()
  }
}

function handleMouseMove(event) {
  if (activeCluster) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left
    const mouseY = event.clientY - canvas.getBoundingClientRect().top
    activeCluster.position.x = mouseX - activeCluster.mouseOffsetX
    activeCluster.position.y = mouseY - activeCluster.mouseOffsetY
    activeCluster.rearrangePieces()
    drawBoard()
  }
}

function handleMouseUp() {
  if (activeCluster) {
    puzzle.clusters.forEach(otherCluster => {
      if (otherCluster != activeCluster) {
        const matchFound = activeCluster.isMatch(otherCluster)
        if (matchFound) {
          puzzle.mergeClusters(activeCluster, otherCluster)
        }
      }
    })
    activeCluster.moving = false
    activeCluster = null
  }
  drawBoard()
}
