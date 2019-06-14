import React from 'react'
import '../style/App.css'

type SinkProps = {
  value: number
}

class Sink extends React.Component<SinkProps> {
  render() {
    return (
      <div className='sink'>
        <p className='arrow'>{'=>'}</p>
        <p className='value'>
          {this.props.value === undefined ? '?' : this.props.value}
        </p>
      </div>
    )
  }
}

export default Sink
