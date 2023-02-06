import { KEYS } from './constants';
import { Painter } from './painter';
import { Shape } from './vite-env';

/* JS doesn't like subtracting decimals correctly */
function subtractFloat(f1: number, f2: number, decimals = 1) {
  return Math.round((f1 - f2) * 10 ** decimals) / 10 ** decimals
}

/* Handles drawing the canvas and abstracts the coordinate system */
export class InfiniteCanvas {
  private canvas;
  public context;
  // TODO move everything to this. Why? this is easier to pass around without constantly creating objects.
  private coords = {
    x: 0,
    y: 0,
    offset: { x: 0, y: 0 },
    scale: 1
  }
  private shapes: Shape[] = [];

  mouse = {
    m1: false,
    m2: false,
    x: 0,
    y: 0,
    prev: { x: 0, y: 0 },
  }

  keys = {
    [KEYS.SPACE]: false,
  }

  private painter;

  // Given x||y from the canvas's coords, return the underlying coordinate
  rawX = (x: number) => (x / this.coords.scale) - this.coords.offset.x;
  rawY = (y: number) => (y / this.coords.scale) - this.coords.offset.y;

  // Same as above. These are useful if you want "absolute" x||y
  get x() { return this.rawX(this.coords.x) }
  get y() { return this.rawY(this.coords.y) }

  // These will instead give you the absolute canvas size with a given scaler
  get width() {
    return this.canvas.clientWidth / this.coords.scale;
  }
  get height() {
    return this.canvas.clientHeight / this.coords.scale;
  }


  screenX(x: number) {
    return (x + this.coords.offset.x) * this.coords.scale;
  }
  screenY(y: number) {
    return (y + this.coords.offset.y) * this.coords.scale;
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
      x: this.coords.x,
      y: this.coords.y,
      offset: { x: this.coords.offset.x, y: this.coords.offset.y },
      scale: this.coords.scale,
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
          this.screenY(y2),
        );
      }
    }
  }

  /* Resets the coordinate system, placing the center in the top-left */
  reset() {
    this.coords.x = 0;
    this.coords.y = 0;
    this.coords.offset.x = 0;
    this.coords.offset.y = 0;
    this.coords.scale = 1;
    this.render();
  }

  // Use an arrow function as event listener to avoid rebinding `this`
  handleScroll = (event: WheelEvent) => {
    const scaleAmount = -event.deltaY / 500; // Usually 0.2
    this.coords.scale = this.coords.scale * (1 + scaleAmount);

    // zoom the page based on where the cursor is
    const distX = event.pageX / this.canvas.clientWidth;
    const distY = event.pageY / this.canvas.clientHeight;

    // calculate how much we need to zoom
    const unitsZoomedX = this.width * scaleAmount;
    const unitsZoomedY = this.height * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    this.coords.offset.x = subtractFloat(this.coords.offset.x, unitsAddLeft);
    this.coords.offset.y = subtractFloat(this.coords.offset.y, unitsAddTop);

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
    this.updateCursor()
  }

  handleMouseMove = (event: MouseEvent) => {
    this.mouse.x = event.x
    this.mouse.y = event.y

    let deltaX = this.mouse.x - this.mouse.prev.x
    let deltaY = this.mouse.y - this.mouse.prev.y

    if (this.keys[KEYS.SPACE] && this.mouse.m1) {
      this.coords.offset.x += deltaX / this.coords.scale
      this.coords.offset.y += deltaY / this.coords.scale
      this.render()
    }
    
    this.mouse.prev.x = event.x
    this.mouse.prev.y = event.y
    this.updateCursor()
  }

  handleMouseUp = () => {
    this.mouse.m1 = false
    this.mouse.m2 = false
    this.updateCursor()
  }

  // Keyboard events
  handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    switch (event.key) {
      case KEYS.SPACE:
        this.keys[KEYS.SPACE] = true
        this.updateCursor()
    }    
  }
  handleKeyUp = (event: KeyboardEvent) => {
    if (event.repeat) return;
    switch (event.key) {
      case KEYS.SPACE:
        this.keys[KEYS.SPACE] = false
        this.updateCursor()
    }
  }

  updateCursor() {    
    if (this.keys[KEYS.SPACE] && this.mouse.m1) {      
      this.canvas.style.cursor = 'grabbing'
      return
    }
    if (this.keys[KEYS.SPACE]) {
      this.canvas.style.cursor = 'grab'
      return
    } 
    this.canvas.style.cursor = 'initial'
  }
}