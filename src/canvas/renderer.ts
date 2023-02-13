import Data from "./data";

export default class Renderer {
  public context;
  // These will instead give you the absolute canvas size with a given scaler
  get width() {
    return this.canvas.clientWidth / this.data.coords.scale;
  }
  get height() {
    return this.canvas.clientHeight / this.data.coords.scale;
  }
  constructor(
    private canvas: HTMLCanvasElement,
    private data: Data,
  ) {
    this.context = canvas.getContext('2d')
  }
}
