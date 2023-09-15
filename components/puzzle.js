import Piece from './piece.js'
import Cluster from './cluster.js'

export default class Puzzle {
  constructor(args) {
    this.image = args.image
    this.clusters = []
    this.widthPixels = args.widthPixels
    this.heightPixels = args.heightPixels
    this.widthPieces = args.widthPieces
    this.heightPieces = args.heightPieces
  }

  initialize(canvas) {
    const ctx = canvas.getContext('2d')
    this.#createPieces(canvas)
  }

  draw(ctx) {
    this.clusters.sort((a, b) => {
      return a.zindex - b.zindex
    })
    this.clusters.forEach(cluster => cluster.draw(ctx, this.image))
  }

  getClickedCluster(mouseX, mouseY) {
    this.clusters.sort(function (a, b) {
      return b.zindex - a.zindex
    })
    const clickedCluster = this.clusters.find(cluster => cluster.isClicked(mouseX, mouseY))
    if (clickedCluster) {
      clickedCluster.computeMouseOffset(mouseX, mouseY)
      return clickedCluster
    } else {
      return
    }
  }

  mergeClusters(cluster1, cluster2) {
    // merging into cluster1
    let minX = Math.min(cluster1.position.x, cluster2.position.x)
    let minY = Math.min(cluster1.position.y, cluster2.position.y)
    cluster2.pieces.forEach(piece => {
      // update piece clusteroffset here
      piece.clusterOffsetX = piece.dx - cluster1.position.x
      piece.clusterOffsetY = piece.dy - cluster1.position.y
      cluster1.pieces.push(piece)
    })
    cluster1.position = { x: minX, y: minY }
    cluster1.rearrangePieces()
    this.destroyCluster(cluster2)
  }

  destroyCluster(clusterToDestroy) {
    const indexToDestroy = this.clusters.findIndex(cluster => cluster === clusterToDestroy)
    if (indexToDestroy >= 0) {
      this.clusters.splice(indexToDestroy, 1)
    }
  }

  #createPieces(canvas) {
    // calculate the width and height of a piece
    const pieceWidth = Math.floor(this.image.width / this.widthPieces)
    const pieceHeight = Math.floor(this.image.height / this.heightPieces)

    // initialize the first piece source position
    let nextPieceSourcePosition = { x: 0, y: 0 }
    const layout = []

    for (let row = 0; row < this.heightPieces; row++) {
      for (let column = 0; column < this.widthPieces; column++) {

        let nextPieceDestinationPosition = {
          x: Math.floor(Math.random() * (canvas.width - pieceWidth)),
          y: Math.floor(Math.random() * (canvas.height - pieceHeight))
        }

        // shape creation (starting from the top and going clockwise)
        const layoutCount = layout.length
        const shape = []
        row === 0 ? shape.push(0) : shape.push(-layout[layoutCount - this.widthPieces][2])
        column + 1 === this.widthPieces ? shape.push(0) : shape.push(Math.random() < 0.5 ? -1 : 1)
        row + 1 === this.heightPieces ? shape.push(0) : shape.push(Math.random() < 0.5 ? -1 : 1)
        column === 0 ? shape.push(0) : shape.push(-layout[layoutCount - 1][1])
        layout.push(shape)

        const newPiece = new Piece({
          coordinates: { x: column, y: row },
          sx: nextPieceSourcePosition.x, sy: nextPieceSourcePosition.y,
          sWidth: pieceWidth, sHeight: pieceHeight,
          // dx: nextPieceSourcePosition.x, dy: nextPieceSourcePosition.y,
          dx: nextPieceDestinationPosition.x, dy: nextPieceDestinationPosition.y,
          dWidth: pieceWidth, dHeight: pieceHeight,
          shape: shape
        })

        const newCluster = new Cluster({
          piece: newPiece,
          position: { x: nextPieceDestinationPosition.x, y: nextPieceDestinationPosition.y }
        })

        this.clusters.push(newCluster)
        nextPieceSourcePosition.x += pieceWidth
      }
      nextPieceSourcePosition.x = 0
      nextPieceSourcePosition.y += pieceHeight
    }
  }
}
