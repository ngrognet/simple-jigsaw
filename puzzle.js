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
    this.draw(ctx)
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

  #createPieces(canvas) {
    const pieceWidth = Math.floor(this.image.width / this.widthPieces)
    const pieceHeight = Math.floor(this.image.height / this.heightPieces)

    let nextPieceSourcePosition = { x: 0, y: 0 }

    for (let row = 0; row < this.heightPieces; row++) {
      for (let column = 0; column < this.widthPieces; column++) {

        let nextPieceDestinationPosition = {
          x: Math.floor(Math.random() * (canvas.width - pieceWidth)),
          y: Math.floor(Math.random() * (canvas.height - pieceHeight))
        }

        const newPiece = new Piece({
          coordinates: { x: column, y: row },
          sx: nextPieceSourcePosition.x, sy: nextPieceSourcePosition.y,
          sWidth: pieceWidth, sHeight: pieceHeight,
          dx: nextPieceDestinationPosition.x, dy: nextPieceDestinationPosition.y,
          dWidth: pieceWidth, dHeight: pieceHeight
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
}
