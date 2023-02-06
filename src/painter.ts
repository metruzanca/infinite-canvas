import { BACKGROUND, DEFAULT_FONT_OPTIONS, DEFAULT_STOKE_COLOR } from "./constants";

/*
 * Utility class for drawing to the canvas.
 * All methods allow chaining.
 **/
export class Painter {
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

  drawRect(
    x0: number, y0: number,
    width: number, height: number,
    { fillStyle = DEFAULT_STOKE_COLOR } = {}
  ) {
    this.context.fillStyle = fillStyle;
    this.context.fillRect(x0, y0, width, height);

    return this;
  }

  writeText(x: number, y: number, text: string, options = DEFAULT_FONT_OPTIONS) {
    this.context.font = `${options.fontSize}px ${options.fontFamily || ''}`
    this.context.fillStyle = options.color;
    this.context.fillText(text, x, y);
  }

  clear(fillStyle = BACKGROUND) {
    const { width, height } = this.context.canvas;
    this.drawRect(0, 0, width, height, { fillStyle });

    return this;
  }
}