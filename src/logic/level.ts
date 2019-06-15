// the transform function recieves an array of numbers per source and returns an array of numbers per sink
export type transform = (sourceValues: number[][]) => number[][]

export type level = {
  title: string
  description: string
  x: number
  y: number
  sources: number[]
  sinks: number[]
  transform: transform
}

export let level1: level = {
  title: 'Start',
  description: 'Multiply all the numbers by 2',
  x: 3,
  y: 2,
  sources: [0, 2],
  sinks: [1],
  transform: (sourceValues: number[][]) =>
    sourceValues.map(source => source.map(value => value * 2))
}
