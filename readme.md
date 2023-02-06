# Infinite Canvas (demo)
Infinite canvas implementation akin to figma (_but without webGL. That'll be done [here](https://github.com/metruzanca/infinite-canvas-webgl)_).


This repository has branches for each major milestone for implementing the infinite canvas:
- [basic-canvas](https://github.com/metruzanca/infinite-canvas/tree/basic-canvas)
- [canvas-class](https://github.com/metruzanca/infinite-canvas/tree/canvas-class): refactors the basic canvas in preparation to encapsulate complex coordinate system
- [canvas-zoom](https://github.com/metruzanca/infinite-canvas/tree/canvas-zoom): Adds zooming via scroll
- [infinite-canvas](https://github.com/metruzanca/infinite-canvas/tree/infinite-canvas): Adds "dragging around" by holding space and clicking.


[Master](https://github.com/metruzanca/infinite-canvas/tree/master) has a few more bells and wistles, namely it has clickable links which are made up of two shapes along with a rudimentary collision system.


## Why make this?
It seemed like a trend to make an app with an infinite canvas, so I wanted to try to make one myself. I'm thinking about making an app of my own using an infinite canvas and while I could have made it directly with something like PixiJS, I wanted to first try making it in vanillaJS.

> That being said, I did use typescript and vite just to make my development experience better, but neither are necessary. Stripping them out would be trivial.

<details>
<summary>TODO, maybe</summary>

- [ ] Occlusion culling?
- [ ] [Text highlighting](https://gist.github.com/smagch/3270ff7b5e62c0dbfebea3464fbcab5a)?
</details>

