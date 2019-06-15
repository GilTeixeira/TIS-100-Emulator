import React from 'react'
import '../style/App.css'

type LevelInfoProps = {
  title: string
  description: string
}

class LevelInfo extends React.Component<LevelInfoProps> {
  render() {
    return (
      <div className='levelInfo'>
        <h1>{`- ${this.props.title} -`}</h1>
        <p>{` > ${this.props.description}`}</p>
      </div>
    )
  }
}

export default LevelInfo
