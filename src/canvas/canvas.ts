import Data from "./data";
import Interractions from "./interractions";
import Renderer from "./renderer";

export default class InfiniteCanvas2 {
  renderer: Renderer
  data: Data
  constructor(canvas: HTMLCanvasElement) {
    this.data = new Data()
    this.renderer = new Renderer(canvas, this.data)
    // this.interractions = new Interractions(canvas)
  }
}