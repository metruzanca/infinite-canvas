import { DEFAULT_FONT_OPTIONS } from './constants';
import { InfiniteCanvas } from './infiniteCanvas';
import './style.css'

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// const instance = new InfiniteCanvas(canvas);

// const drawCross = () => {
//   instance
//     .removeAllShapes()
//     // Too lazy to figure out rect for a square box
//     .addShape({
//       type: "line",
//       // Vertical Line
//       coords: [[0, 0], [0, instance.height]]
//     })
//     .addShape({
//       type: "line",
//       // Vertical Line
//       coords: [[instance.width, 0], [instance.width, instance.height]]
//     })
//     .addShape({
//       type: "line",
//       // Horrizontal Line
//       coords: [[0, instance.height], [instance.width, instance.height]]
//     })
//     .addShape({
//       type: "line",
//       // Horrizontal Line
//       coords: [[0, 0], [instance.width, 0]]
//     })
//     .addShape({
//       type: 'text',
//       origin: [instance.width / 12, instance.height / 2 - 100],
//       text: 'Figma-like Infinite Canvas.\nBuilt with Typescript & ❤️',
//       options: {
//         ...DEFAULT_FONT_OPTIONS,
//         fontSize: 50,
//       },
//     })
//     .addShape({
//       type: 'text',
//       origin: [instance.width / 12, instance.height / 2 - 70],
//       text: 'tl;dr; typescript for better intellisense, vite for convienient bundling. Rest is vanillaJS.',
//       options: {
//         ...DEFAULT_FONT_OPTIONS,
//         fontSize: 20,
//         color: '#666B8A'
//       },
//     })
//     .addShape({
//       type: 'text',
//       origin: [instance.width / 12, instance.height / 2 - 10],
//       text: 'Press and hold space to drag the canvas',
//       options: DEFAULT_FONT_OPTIONS,
//     })
//     .addShape({
//       type: 'text',
//       origin: [instance.width / 12, instance.height / 2 + 40],
//       text: 'Scroll to zoom in / out',
//       options: DEFAULT_FONT_OPTIONS,
//     })
//     .addShape({
//       type: 'text',
//       origin: [instance.width / 12, instance.height / 2 + 90],
//       text: 'Press the R key to reset zoom',
//       options: DEFAULT_FONT_OPTIONS,
//     })
//     .addShape({
//       type: 'entity',
//       entity: 'link',
//       origin: [instance.width / 12, instance.height / 2 + 150],
//       text: 'Source on Github',
//       options: {
//         ...DEFAULT_FONT_OPTIONS,
//       },
//       url: 'https://github.com/metruzanca/infinite-canvas',
//     });

//     instance.render();
// }

// drawCross()

// window.addEventListener("keypress", (event) => {
//   switch (event.key) {
//     case 'r':
//       console.log("Resetting...");
//       instance.reset();
//       drawCross()
//       break
//   }
// });
// // if (import.meta.env.DEV) {
// // }

