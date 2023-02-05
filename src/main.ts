import './style.css'


function resize(canvas) {
  canvas.height = document.body.clientHeight
  canvas.width = document.body.clientWidth
}

function clear(canvas, ctx, { bg = '#282a36' } = {}) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSquare(ctx, { x = 0, y = 0, size = 100, color = 'blue' } = {}) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function main() {
  const canvas = document.getElementById('canvas')! as HTMLCanvasElement
  const context = canvas.getContext("2d")

  let x = 0, y = 0;

  // Renderer
  const rerender = () => {
    resize(canvas)
    clear(canvas, context)

    drawSquare(context, {
      x, y, size: 200, color: 'blue'
    })
  }


  // Events
  canvas.addEventListener('click', e => {
    console.log(e.clientX, e.clientY)
    x = e.clientX
    y = e.clientY

    rerender()
  })

  // Initial Paint
  rerender()
}

main()