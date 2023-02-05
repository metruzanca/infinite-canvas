import { Painter } from './painter';
import { Shape } from './vite-env';

/* JS doesn't like subtracting decimals correctly */
function subtractFloat(f1: number, f2: number, decimals = 1) {
  return Math.round((f1 - f2) * 10 ** decimals) / 10 ** decimals
}

/* Handles drawing the canvas and abstracts the coordinate system */
export class InfiniteCanvas {
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

  private mouse = {
    m1: false,
    m2: false,
    x: 0,
    y: 0,
    prev: { x: 0, y: 0 }
  }

  private keys = {

  }

  private painter;

  // Given x||y from the canvas's coords, return the underlying coordinate
  rawX = (x: number) => (x / this.scale) - this.offsetX;
  rawY = (y: number) => (y / this.scale) - this.offsetY;

  // Same as above. These are useful if you want "absolute" x||y
  get x() { return this.rawX(this._x) }
  get y() { return this.rawY(this._y) }

  // These will instead give you the absolute canvas size with a given scaler
  get width() {
    return this.canvas.clientWidth / this.scale;
  }
  get height() {
    return this.canvas.clientHeight / this.scale;
  }


  screenX(x: number) {
    return (x + this.offsetX) * this.scale;
  }
  screenY(y: number) {
    return (y + this.offsetX) * this.scale;
  }

  /* Ensure the canvas size = body size */
  resize() {
    this.canvas.height = document.body.clientHeight;
    this.canvas.width = document.body.clientWidth;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    // Instantiate extensions
    this.painter = new Painter(this.context);

    // Mouse Events
    canvas.addEventListener("wheel", this.handleScroll);
    canvas.addEventListener("mousedown", this.handleMouseDown);
    canvas.addEventListener("mouseup", this.handleMouseUp);
    canvas.addEventListener("mousemove", this.handleMouseMove);

    // Keyboard Events
    canvas.addEventListener('keydown', this.handleKeyDown)
    canvas.addEventListener('keyup', this.handleKeyUp)
    /* Disable Right click */
    // Don't think it works in codepen
    canvas.addEventListener("contextmenu", event => event.preventDefault());
    window.addEventListener('resize', () => this.render(), true)

    this.render();
  }

  get meta() {
    return {
      x: this._x,
      y: this._y,
      offset: { x: this.offsetX, y: this.offsetY },
      scale: this.scale,
    };
  }

  debug() {
    console.log(JSON.stringify(this.meta, null, 2));
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

  removeShape(index: number) {
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
  handleScroll = (event: WheelEvent) => {
    const scaleAmount = -event.deltaY / 500; // Usually 0.2
    this.scale = this.scale * (1 + scaleAmount);

    // zoom the page based on where the cursor is
    const distX = event.pageX / this.canvas.clientWidth;
    const distY = event.pageY / this.canvas.clientHeight;

    // calculate how much we need to zoom
    const unitsZoomedX = this.width * scaleAmount;
    const unitsZoomedY = this.height * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    this.offsetX = subtractFloat(this.offsetX, unitsAddLeft);
    this.offsetY = subtractFloat(this.offsetY, unitsAddTop);

    this.render();
  };

  handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      this.mouse.m1 = true
      this.mouse.m2 = false
    }
    if (event.button === 2) {
      this.mouse.m1 = false
      this.mouse.m2 = true
    }

    this.mouse.x = this.mouse.prev.x = event.pageX
    this.mouse.y = this.mouse.prev.y = event.pageY
    console.log(this.mouse);

    this.canvas.style.cursor = 'grabbing'
  }

  handleMouseUp = () => {
    this.mouse.m1 = false
    this.mouse.m2 = false
    this.canvas.style.cursor = 'initial'
  }

  handleMouseMove = (event: MouseEvent) => {
  }


  // Keyboard events
  handleKeyDown = (event: KeyboardEvent) => {
    console.log(event.key);

  }
  handleKeyUp = (event: KeyboardEvent) => {

  }
}