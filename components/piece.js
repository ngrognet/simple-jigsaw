export default class Piece {
  constructor(args) {
    this.zindex = 0
    this.coordinates = args.coordinates

    // canvas draw params
    this.sx = args.sx
    this.sy = args.sy
    this.sWidth = args.sWidth
    this.sHeight = args.sHeight
    this.dx = args.dx
    this.dy = args.dy
    this.dWidth = args.dWidth
    this.dHeight = args.dHeight

    // mouse offset
    this.mouseOffsetX = null
    this.mouseOffsetY = null

    // cluster offset
    this.clusterOffsetX = 0
    this.clusterOffsetY = 0
  }

  draw(ctx, image, moving) {
    ctx.drawImage(image, this.sx, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight)
    if (moving) {
      ctx.strokeStyle = 'white'
    } else {
      ctx.strokeStyle = 'black'
    }
    ctx.lineWidth = 2
    ctx.strokeRect(this.dx, this.dy, this.dWidth, this.dHeight)
  }

  bounds() {
    return {
      top: this.dy,
      bottom: this.dy + this.dHeight,
      left: this.dx,
      right: this.dx + this.dWidth
    }
  }

  isClicked(mouseX, mouseY) {
    return (
      (this.between(mouseX, this.bounds().left, this.bounds().right))
      && (this.between(mouseY, this.bounds().top, this.bounds().bottom))
    )
  }

  computeMouseOffset(mouseX, mouseY) {
    this.mouseOffsetX = mouseX - this.dx
    this.mouseOffsetY = mouseY - this.dy
  }

  isMatch(otherPiece) {
    const topMatch = this.matchFromTop(otherPiece)
    const bottomMatch = this.matchFromBottom(otherPiece)
    const leftMatch = this.matchFromLeft(otherPiece)
    const rightMatch = this.matchFromRight(otherPiece)
    return (topMatch || bottomMatch || leftMatch || rightMatch)
  }

  matchFromTop(otherPiece) {
    return this.coordinates.x === otherPiece.coordinates.x
      && this.coordinates.y + 1 === otherPiece.coordinates.y
      && this.near(this.dx, otherPiece.dx, 20)
      && this.near(this.dy + this.dHeight, otherPiece.dy, 20)
  }

  matchFromBottom(otherPiece) {
    return this.coordinates.x === otherPiece.coordinates.x
      && this.coordinates.y - 1 === otherPiece.coordinates.y
      && this.near(this.dx, otherPiece.dx, 20)
      && this.near(this.dy - this.dHeight, otherPiece.dy, 20)
  }

  matchFromLeft(otherPiece) {
    return this.coordinates.x + 1 === otherPiece.coordinates.x
      && this.coordinates.y === otherPiece.coordinates.y
      && this.near(this.dx + this.dWidth, otherPiece.dx, 20)
      && this.near(this.dy, otherPiece.dy, 20)
  }

  matchFromRight(otherPiece) {
    return this.coordinates.x - 1 === otherPiece.coordinates.x
      && this.coordinates.y === otherPiece.coordinates.y
      && this.near(this.dx - this.dWidth, otherPiece.dx, 20)
      && this.near(this.dy, otherPiece.dy, 20)
  }

  between(x, min, max) {
    return x >= min && x <= max
  }

  near(a, b, tolerance) {
    return Math.abs(a - b) <= tolerance
  }
}
