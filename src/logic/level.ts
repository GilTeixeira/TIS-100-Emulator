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
  description: 'Multiply all numbers by 2\nLinha\nOutra Linha\nE outra linha',
  x: 3,
  y: 2,
  sources: [0],
  sinks: [0],
  transform: (sourceValues: number[][]) =>
    sourceValues.map(source => source.map(value => value * 2)),
}


export let level2: level = {
  title: 'Start',
  description: 'Write to OUT 1 if IN is higher than 50\nWrite to OUT 0 otherwise',
  x: 3,
  y: 2,
  sources: [0],
  sinks: [0],
  transform: (sourceValues: number[][]) =>
    sourceValues.map(source => source.map(value => {
      if(value > 50) 
        {return 1} else 
      {return 0}}))
}

export let level3: level = {
  title: 'Start',
  description: 'Multiply all the numbers by 4',
  x: 3,
  y: 2,
  sources: [0],
  sinks: [0],
  transform: (sourceValues: number[][]) =>
    sourceValues.map(source => source.map(value => value * 4))
}
