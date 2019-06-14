import React from 'react'
import '../style/App.css'

import Node from './Node'
import Sink from './Sink'

import { BasicExecutionNode, Sink as SinkLogic, NullSink } from '../logic/node'

type NodeGridProps = {
  grid: BasicExecutionNode[][]
  sinks: SinkLogic[]
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
      console.log(i)
      if (sink instanceof NullSink)
        return <div key={`sink${i}`} className='nullSink' />
      else return <Sink key={`sink${i}`} value={sink.getSrcPort().getValue()} />
    })

    return (
      <div className='grid'>
        {grid}
        <div className='sinks'>{sinks}</div>
      </div>
    )
  }
}

export default NodeGrid
