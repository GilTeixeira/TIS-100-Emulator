import React from 'react'
import '../style/App.css'

import { Sink as SinkLogic } from '../logic/node'

type SinkProps = {
  sink: SinkLogic
}

class Sink extends React.Component<SinkProps> {
  render() {
    return (
      <div className='sink'>
        <p className='arrow'>{'=>'}</p>
        <p className='value'>
          {this.props.sink.getSrcPort().getValue() === undefined ? '?' : this.props.sink.getSrcPort().getValue()}
        </p>
        <div className='info'>
          <p>{`OUT.${this.props.sink.getID()}`}</p>
        </div>
      </div>
    )
  }
}

export default Sink
