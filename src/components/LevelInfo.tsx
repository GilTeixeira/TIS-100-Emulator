import React from 'react'
import '../style/App.css'

type LevelInfoProps = {
  title: string
  description: string
}

class LevelInfo extends React.Component<LevelInfoProps> {
  render() {
    let desc = this.props.description

    let desLines = desc.split('\n').map((item, i) => {
      return <p key={i}>{`> ${item} `}</p>; 
    });

    return (
      <div className='levelInfo'>
        <h1>{`- ${this.props.title} -`}</h1>
        <div className='levelDescription'>{desLines}</div>
      </div>
    )
  }
}

export default LevelInfo
