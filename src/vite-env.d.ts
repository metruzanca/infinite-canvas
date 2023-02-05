/// <reference types="vite/client" />

export type Point = [number, number]

export type Dot = {
  type: 'dot'
  origin: [number, number]
}

export type Line = {
  type: 'line'
  coords: [Point, Point]
}

export type Rect = {
  type: 'rect'
  origin: Point
  width: number
  height: number
}

export type Shape = Dot | Line | Rect
