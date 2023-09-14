export default class Cluster {
  constructor(args) {
    this.pieces = [args.piece]
    this.position = args.position
    this.moving = false
    this.zindex = 0
    this.mouseOffsetX = 0
    this.mouseOffsetY = 0
  }

  draw(ctx, image) {
    this.pieces.forEach(piece => piece.draw(ctx, image, this.moving))
  }

  isClicked(mouseX, mouseY) {
    return this.pieces.some(piece => piece.isClicked(mouseX, mouseY))
  }

  computeMouseOffset(mouseX, mouseY) {
    this.mouseOffsetX = mouseX - this.position.x
    this.mouseOffsetY = mouseY - this.position.y
  }

  isMatch(otherCluster) {
    let matchFound = false
    this.pieces.forEach(piece => {
      otherCluster.pieces.forEach(otherPiece => {
        if (piece != otherPiece && !matchFound) {
          matchFound = piece.isMatch(otherPiece)
        }
      })
    })
    return matchFound
  }

  rearrangePieces() {
    if (this.pieces.length > 0) {
      const pieceWidth = this.pieces[0].dWidth
      const pieceHeight = this.pieces[0].dHeight
      let minX = this.pieces[0].coordinates.x
      let minY = this.pieces[0].coordinates.y
      this.pieces.forEach(piece => {
        if (piece.coordinates.x < minX) minX = piece.coordinates.x
        if (piece.coordinates.y < minY) minY = piece.coordinates.y
      })
      this.pieces.forEach(piece => {
        piece.dx = this.position.x + ((piece.coordinates.x - minX) * pieceWidth)
        piece.dy = this.position.y + ((piece.coordinates.y - minY) * pieceHeight)
      })
    }
  }
}
