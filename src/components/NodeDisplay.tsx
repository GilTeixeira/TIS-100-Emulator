import React from 'react'
import '../style/App.css'

type NodeDisplayProps = {
  tooltip: string
  value: any
}

class NodeDisplay extends React.Component<NodeDisplayProps> {
  render() {
    return (
      <div className='display'>
        <p className='tooltip'>{this.props.tooltip}</p>
        <p className='value'>{this.props.value}</p>
      </div>
    )
  }
}

export default NodeDisplay
