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
    widthPieces: 4,
    heightPieces: 4
  })
  drawBoard(ctx, puzzle)
  puzzle.initialize(canvas)

  canvas.addEventListener("mousedown", handleMouseDown)
  canvas.addEventListener("mousemove", handleMouseMove)
  canvas.addEventListener("mouseup", handleMouseUp)

  drawBoard(ctx, puzzle)
  drawJigsawShape([0,1,-1,1])
}

function drawJigsawShape(shape) {
  let pen = { x: 100, y: 100 }
  const step = 20
  const bezelBase = 15
  const bezelTop = bezelBase * shape[0]
  const bezelRight = bezelBase * shape[1]
  const bezelBottom = bezelBase * shape[2]
  const bezelLeft = bezelBase * shape[3]
  ctx.strokeStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(pen.x, pen.y)

  // top side
  pen.x += step
  ctx.lineTo(pen.x, pen.y)
  pen.y -= bezelTop
  ctx.lineTo(pen.x, pen.y)
  pen.x += step
  ctx.lineTo(pen.x, pen.y)
  pen.y += bezelTop
  ctx.lineTo(pen.x, pen.y)
  pen.x += step
  ctx.lineTo(pen.x, pen.y)

  // right side
  pen.y += step
  ctx.lineTo(pen.x, pen.y)
  pen.x += bezelRight
  ctx.lineTo(pen.x, pen.y)
  pen.y += step
  ctx.lineTo(pen.x, pen.y)
  pen.x -= bezelRight
  ctx.lineTo(pen.x, pen.y)
  pen.y += step
  ctx.lineTo(pen.x, pen.y)

  // bottom side
  pen.x -= step
  ctx.lineTo(pen.x, pen.y)
  pen.y += bezelBottom
  ctx.lineTo(pen.x, pen.y)
  pen.x -= step
  ctx.lineTo(pen.x, pen.y)
  pen.y -= bezelBottom
  ctx.lineTo(pen.x, pen.y)
  pen.x -= step
  ctx.lineTo(pen.x, pen.y)

  // left side
  pen.y -= step
  ctx.lineTo(pen.x, pen.y)
  pen.x -= bezelLeft
  ctx.lineTo(pen.x, pen.y)
  pen.y -= step
  ctx.lineTo(pen.x, pen.y)
  pen.x += bezelLeft
  ctx.lineTo(pen.x, pen.y)
  pen.y -= step
  ctx.lineTo(pen.x, pen.y)

  ctx.closePath()
  ctx.stroke()
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
