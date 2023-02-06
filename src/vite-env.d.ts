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

// A failed attempt to get the 
export type FontOptions = {
  color: string
  fontFamily: string
  fontSize: number
}

export type Text = {
  type: 'text'
  origin: Point
  text: string
  options: FontOptions
}

export type Shape = Dot | Line | Rect | Text
