import React from 'react'
import '../style/App.css'

import Node from './Node'
import Sink from './Sink'
import Source from './Source'

import {
  BasicExecutionNode,
  Sink as SinkLogic,
  Source as SourceLogic,
  NullSink,
  NullSource
} from '../logic/node'

type NodeGridProps = {
  grid: BasicExecutionNode[][]
  sinks: SinkLogic[]
  sources: SourceLogic[]
}

class NodeGrid extends React.Component<NodeGridProps> {
  render() {
    const grid = this.props.grid.map((gridRow, i) => {
      let nodes = gridRow.map((node, i) => (
        <Node key={`node${i}`} node={node} />
      ))

      return (
        <div key={`nodeGrid${i}`} className='gridRow'>
          {nodes}
        </div>
      )
    })

    const sinks = this.props.sinks.map((sink, i) => {
      if (sink instanceof NullSink)
        return <div key={`sink${i}`} className='nullSink' />
      else return <Sink key={`sink${i}`} sink={sink} />
    })

    const sources = this.props.sources.map((source, i) => {
      if (source instanceof NullSource)
        return <div key={`source${i}`} className='nullSource' />
      else return <Source key={`source${i}`} source={source} />
    })

    return (
      <div className='grid'>
        <div className='sources'>{sources}</div>
        {grid}
        <div className='sinks'>{sinks}</div>
      </div>
    )
  }
}

export default NodeGrid
