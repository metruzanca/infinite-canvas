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

