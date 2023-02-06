import { KEYS, LINK } from './constants';
import { Painter } from './painter';
import { Entities, Shape } from './vite-env';

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
  public shapes: Shape[] = [];
  /** A sub array of shapes for faster checks */
  private entityShapes: Entities[] = []

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
    if (shape.type === 'entity') {
      this.entityShapes.push(shape)
    }
    this.shapes.push(shape);
    return this;
  }

  private draw() {
    for (let shape of this.shapes) {
      switch (shape.type) {
        case 'dot': {
          const { origin: [x, y] } = shape
          this.painter.drawArc(
            this.screenX(x),
            this.screenY(y),
            10 * this.coords.scale,
          )
          break
        }
        case 'line': {
          const { coords: [[x1, y1], [x2, y2]] } = shape
          this.painter.drawLine(
            this.screenX(x1),
            this.screenY(y1),
            this.screenX(x2),
            this.screenY(y2),
          );
          break;
        }
        case 'text': {
          const { origin: [x, y], text, options } = shape
          this.painter.writeText(this.screenX(x), this.screenY(y), text, {
            ...options,
            fontSize: (options.fontSize * this.coords.scale),
          })
          break
        }
        case 'entity': {
          this.drawEntity(shape)
          break
        }
      }
    }
  }
 
  // Moved here because I might add more types of entities
  // REFACTOR
  private drawEntity(shape: Entities) {    
    switch(shape.entity) {
      case 'link': {
        const { origin: [x, y], text, options, url } = shape
        this.painter.writeText(this.screenX(x), this.screenY(y), text, {
          ...options,
          color: LINK.TEXT, 
          fontSize: (options.fontSize * this.coords.scale),
        })
        // REFACTOR
        if (!shape.size) shape.size = {
          width: this.context.measureText(shape.text).width,
          height: shape.options.fontSize,
        }
        const width = this.painter.measureText(text)
        const lx = this.screenX(x);
        const ly = this.screenY(y);
        const lineMargin = 3;
        this.painter.drawLine(lx, ly + lineMargin, lx + width, ly + lineMargin, {
          strokeStyle: LINK.TEXT
        })
        break;
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

    this.coords.offset.x = this.coords.offset.x - unitsAddLeft
    this.coords.offset.y = this.coords.offset.y - unitsAddTop

    this.render();
  };

  handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      this.mouse.m1 = true
      this.mouse.m2 = false

      let collidedShape = this.entityShapes[this.collidedEntity]
      if (collidedShape && collidedShape.entity === 'link') {
        window.location.href = collidedShape.url
      }
    }
    if (event.button === 2) {
      this.mouse.m1 = false
      this.mouse.m2 = true
    }

    this.mouse.x = this.mouse.prev.x = event.pageX
    this.mouse.y = this.mouse.prev.y = event.pageY
    this.updateCursor()
  }

  collidedEntity = -1;

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

    this.entityShapes.forEach((shape, i) => {
      const lx = this.screenX(shape.origin[0]); 
      const ly = this.screenY(shape.origin[1]);
      const { x, y } = this.mouse
      const collision = (
        x >= lx &&
        x <= (lx + shape.size?.width!) &&
        y <= ly &&
        y >= (ly - shape.size?.height!)
      )
      shape.hovered = collision
  
      // FIXME with multiple entity, this wont work anymore
      if (collision) { 
        this.collidedEntity = i
      } else {
        this.collidedEntity = -1
      }
    })
    
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
    if (this.entityShapes[this.collidedEntity]) {
      this.canvas.style.cursor = 'pointer'
      return
    }
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