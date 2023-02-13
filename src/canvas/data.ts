import { KEYS } from "../constants";
import { Entities, Shape } from "../vite-env";

export default class Data {
  public coords = {
    x: 0,
    y: 0,
    offset: { x: 0, y: 0 },
    scale: 1
  }
  public shapes: Shape[] = [];
  /** A sub array of shapes for faster checks */
  public entityShapes: Entities[] = []

  public collidedEntity = -1;

  // Given x||y from the canvas's coords, return the underlying coordinate
  toTrueX = (x: number) => (x / this.coords.scale) - this.coords.offset.x;
  totrueY = (y: number) => (y / this.coords.scale) - this.coords.offset.y;

  // Same as above. These are useful if you want "absolute" x||y
  get x() { return this.toTrueX(this.coords.x) }
  get y() { return this.totrueY(this.coords.y) }

  toCanvasX(x: number) {
    return (x + this.coords.offset.x) * this.coords.scale;
  }
  toCanvasY(y: number) {
    return (y + this.coords.offset.y) * this.coords.scale;
  }

  updateView(offsetX: number, offsetY: number, scale: number) {
    this.coords.offset.x = offsetX;
    this.coords.offset.y = offsetY;
    this.coords.scale = scale;
  }

  reset() {
    this.coords.x = 0;
    this.coords.y = 0;
    this.coords.offset.x = 0;
    this.coords.offset.y = 0;
    this.coords.scale = 1;
  }
}
