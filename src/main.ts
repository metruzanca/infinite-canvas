import './style.css'

/* Sets canvas size to be equal to body */
function resize(canvas) {
  canvas.height = document.body.clientHeight
  canvas.width = document.body.clientWidth
}

/* Clear the canvas */
function clear(canvas, ctx, { bg = '#282a36' } = {}) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* Draw a square to the canvas */
function drawSquare(ctx, { x = 0, y = 0, size = 100, color = 'blue' } = {}) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

/* Handles drawing the canvas and abstracts the coordinate system */
class InfiniteCanvas {
  private canvas;
  private context;
  x = 0;
  y = 0;

  debug() {
    console.log(`x: ${this.x}, y: ${this.y}`)
  }

  render() {
    resize(this.canvas)
    clear(this.canvas, this.context)

    drawSquare(this.context, {
      x: this.x, y: this.y, size: 200, color: 'blue'
    })

    this.debug()
  }
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext("2d")

    this.render()
  }
}

const canvas = document.getElementById('canvas')
const instance = new InfiniteCanvas(document.getElementById('canvas'))
