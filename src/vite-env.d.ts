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

export type LineOptions = {
  strokeStyle: string
  lineWidth: number
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
  /** For some cursed reason, origin for text is bottom-left instead of top-left like the canvas */
  origin: Point
  text: string
  options: FontOptions
}

type Entity<T> = Omit<T, 'type'> & { type: 'entity' }

export type Link = Entity<Text> & {
  entity: 'link'

  url: string
  hovered?: boolean
  size?: {
    width: number
    height: number
  }
}

export type Shape = Dot | Line | Rect | Text | Link
export type Entities = Link