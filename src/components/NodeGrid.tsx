import React from 'react'
import '../style/App.css'
import Node from './Node'
import { BasicExecutionNode } from '../logic/node'

type NodeGridProps = {
  grid: BasicExecutionNode[][]
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
    return <div className='grid'>{grid}</div>
  }
}

export default NodeGrid
