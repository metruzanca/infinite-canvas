import { KEYS } from "../constants";
import Data from "./data";

export default class Interractions {
  constructor(
    private canvas: HTMLCanvasElement,
    private data: Data,
  ) {

  }

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

  // Use an arrow function as event listener to avoid rebinding `this`
  handleScroll = (event: WheelEvent) => {
    const scaleAmount = -event.deltaY / 500; // Usually 0.2
    this.data.coords.scale = this.data.coords.scale * (1 + scaleAmount);

    // zoom the page based on where the cursor is
    const distX = event.pageX / this.canvas.clientWidth;
    const distY = event.pageY / this.canvas.clientHeight;

    const width = this.canvas.clientWidth / this.data.coords.scale
    const height = this.canvas.clientHeight / this.data.coords.scale

    // calculate how much we need to zoom
    const unitsZoomedX = width * scaleAmount;
    const unitsZoomedY = height * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    this.data.coords.offset.x = this.data.coords.offset.x - unitsAddLeft
    this.data.coords.offset.y = this.data.coords.offset.y - unitsAddTop
  };

  handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      this.mouse.m1 = true
      this.mouse.m2 = false

      let collidedShape = this.data.entityShapes[this.collidedEntity]
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
      this.data.coords.offset.x += deltaX / this.data.coords.scale
      this.data.coords.offset.y += deltaY / this.data.coords.scale
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
