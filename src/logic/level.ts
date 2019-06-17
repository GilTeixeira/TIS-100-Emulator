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

export const levels: level[] = [
  {
    title: 'Level 1',
    description:
      'Read a value from in.0 and write it to out.0\nRead a value from in.1 and write it to out.1',
    x: 3,
    y: 3,
    sources: [0, 2],
    sinks: [0, 2],
    transform: (sourceValues: number[][]) => sourceValues
  },
  {
    title: 'Level 2',
    description:
      'Read a value from in.0\nDouble the value\nWrite the value to out.1',
    x: 2,
    y: 2,
    sources: [1],
    sinks: [0],
    transform: (sourceValues: number[][]) =>
      sourceValues.map(source => source.map(value => value * 2))
  },
  {
    title: 'Level 3',
    description:
      'Read values from in.0 and in.1\nwrite in.0 - in.1 to out.0\nwrite in.1 - in.0 to out.1',
    x: 4,
    y: 3,
    sources: [1, 2],
    sinks: [1, 2],
    transform: (sourceValues: number[][]) => {
      const outs: number[][] = []
      outs.push(sourceValues[0].map((value, i) => value - sourceValues[1][i]))
      outs.push(sourceValues[1].map((value, i) => value - sourceValues[0][i]))
      return outs
    }
  },
  {
    title: 'Level 4',
    description:
      'Read a value from in.0\nwrite 1 to out.0 if in.0 > 50\nwrite 1 to out.1 if in.0 <= 50\nwhen a 1 is not written to an output, write 0 a instead',
    x: 3,
    y: 2,
    sources: [1],
    sinks: [0, 2],
    transform: (sourceValues: number[][]) => {
      const out0: number[] = []
      const out1: number[] = []
      sourceValues[0].forEach(value => {
        out0.push(value > 50 ? 1 : 0)
        out1.push(value > 50 ? 0 : 1)
      })
      return [out0, out1]
    }
  }
]
