import React from 'react'
import '../style/App.css'

import { Source as SourceLogic } from '../logic/node'

type SourceProps = {
  source: SourceLogic
}

class Source extends React.Component<SourceProps> {
  render() {
    return (
      <div className='source'>
        <p className='arrow'>{'=>'}</p>
        <p className='value'>
          {this.props.source.getDstPort().getValue() === undefined
            ? '?'
            : this.props.source.getDstPort().getValue()}
        </p>
        <div className='info'>
          <p>{`IN.${this.props.source.getID()}`}</p>
          <p>{`(IDLE ${this.props.source.getIdleness()}%)`}</p>
        </div>
      </div>
    )
  }
}

export default Source
