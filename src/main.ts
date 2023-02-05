import './style.css'

const BACKGROUND = "#282a36";
const DEFAULT_STOKE_COLOR = "#000";

type Point = [number, number]

type Dot = {
  type: 'dot'
  origin: [number, number]
}

type Line = {
  type: 'line'
  coords: [Point, Point]
}

type Rect = {
  type: 'rect'
  origin: Point
  width: number
  height: number
}

type Shape = Dot | Line | Rect

/* JS doesn't like subtracting decimals correctly */
function subtractFloat(f1: number, f2: number, decimals = 1) {
  return Math.round((f1 - f2) * 10 ** decimals) / 10 ** decimals
}

/*
 * Utility class for drawing to the canvas.
 * All methods allow chaining.
 **/
class Painter {
  constructor(private context: CanvasRenderingContext2D) { }
  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.strokeStyle = "#000";
    this.context.lineWidth = 2;
    this.context.stroke();

    return this;
  }

  drawRect(x0, y0, width, height, { fillStyle = DEFAULT_STOKE_COLOR } = {}) {
    this.context.fillStyle = fillStyle;
    this.context.fillRect(x0, y0, width, height);

    return this;
  }

  clear(fillStyle = BACKGROUND) {
    const { width, height } = this.context.canvas;
    this.drawRect(0, 0, width, height, { fillStyle });

    return this;
  }
}

/* Handles drawing the canvas and abstracts the coordinate system */
class InfiniteCanvas {
  private canvas;
  private context;
  // TODO move everything to this. Why? this is easier to pass around without constantly creating objects.
  // private coords = {
  //   x: 0,
  //   y: 0,
  //   offset: { x: 0, y: 0 },
  //   scale: 1
  // };
  private _x = 0;
  private _y = 0;
  private offsetX = 0;
  private offsetY = 0;
  private scale = 1;
  private shapes: Shape[] = [];

  private painter;

  get x() {
    return (this._x + this.offsetX) * this.scale;
  }
  get y() {
    return (this._y + this.offsetX) * this.scale;
  }
  get width() {
    return this.canvas.clientWidth / this.scale;
  }
  get height() {
    return this.canvas.clientHeight / this.scale;
  }

  /* Ensure the canvas size = body size */
  resize() {
    this.canvas.height = document.body.clientHeight;
    this.canvas.width = document.body.clientWidth;
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    // Instantiate extensions
    this.painter = new Painter(this.context);
    // Events
    canvas.addEventListener("wheel", this.handleScroll, false);
    /* Disable Right click */
    // Don't think it works in codepen
    canvas.addEventListener("contextmenu", () => false);
    window.addEventListener('resize', () => this.render(), false)

    this.render();
  }

  get meta() {
    return {
      x: this._x,
      y: this._y,
      offset: { x: this.offsetX, y: this.offsetY },
      scale: this.scale
    };
  }

  screenX(x) {
    return (x + this.offsetX) * this.scale;
  }
  screenY(y) {
    return (y + this.offsetX) * this.scale;
  }

  debug() {
    console.log(this.meta);
  }

  render() {
    this.resize();
    this.painter.clear();

    this.draw();
    this.debug();
  }

  removeAllShapes() {
    // TODO this mutation might be problematic
    this.shapes = []
    return this;
  }

  removeShape(index) {
    this.shapes.splice(index, 1);
    return this;
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
    return this;
  }

  private draw() {
    for (let shape of this.shapes) {
      if (shape.type === 'line') {
        const { coords: [[x1, y1], [x2, y2]] } = shape
        this.painter.drawLine(
          this.screenX(x1),
          this.screenY(y1),
          this.screenX(x2),
          this.screenY(y2)
        );
      }
    }
  }

  /* Resets the coordinate system, placing the center in the top-left */
  reset() {
    this._x = 0;
    this._y = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;
    this.render();
  }

  // Use an arrow function as event listener to avoid rebinding `this`
  handleScroll = event => {
    const scaleAmount = -event.deltaY / 500; // Usually 0.2
    // this.scale = this.scale * (1 + scaleAmount);
    this.scale = subtractFloat(this.scale, scaleAmount)

    // zoom the page based on where the cursor is
    const distX = event.pageX / this.canvas.clientWidth;
    const distY = event.pageY / this.canvas.clientHeight;

    // calculate how much we need to zoom
    const unitsZoomedX = this.width * scaleAmount;
    const unitsZoomedY = this.height * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    this.offsetX = subtractFloat(this.offsetX, unitsAddLeft) || 0;
    this.offsetY = subtractFloat(this.offsetY, unitsAddTop) || 0;

    this.render();
  };

}

// ----- Main -----

const canvas = document.getElementById("canvas");
const instance = new InfiniteCanvas(document.getElementById("canvas"));

const drawCross = () => {
  instance
    .removeAllShapes()
    .addShape({
      type: "line",
      // Vertical Line
      coords: [
        [instance.width / 2, 0],
        [instance.width / 2, instance.height]
      ]
    })
    .addShape({
      type: "line",
      // Horrizontal Line
      coords: [
        [0, instance.height / 2],
        [instance.width, instance.height / 2]
      ]
    })
    .render();
}

drawCross()

window.addEventListener("keypress", (event) => {
  switch (event.key) {
    case 'r':
      console.log("Resetting...");
      drawCross()
      instance.reset();
      break
  }
});

