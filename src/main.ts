import { DEFAULT_FONT_OPTIONS } from './constants';
import { InfiniteCanvas } from './infiniteCanvas';
import './style.css'

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const instance = new InfiniteCanvas(canvas);

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
    .addShape({
      type: 'text',
      origin: [instance.width / 2, instance.height / 2 - 10],
      text: 'Press and hold space to drag the canvas',
      options: DEFAULT_FONT_OPTIONS,
    })
    .addShape({
      type: 'text',
      origin: [instance.width / 2, instance.height / 2 + 40],
      text: 'Scroll to zoom in / out',
      options: DEFAULT_FONT_OPTIONS,
    })
    .addShape({
      type: 'text',
      origin: [instance.width / 2, instance.height / 2 + 90],
      text: 'Press the R key to reset',
      options: DEFAULT_FONT_OPTIONS,
    })
    .render();
}

drawCross()

window.addEventListener("keypress", (event) => {
  switch (event.key) {
    case 'r':
      console.log("Resetting...");
      instance.reset();
      drawCross()
      break
  }
});
// if (import.meta.env.DEV) {
// }

