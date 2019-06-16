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
      return <div key={i}>{`> ${item} `}</div>; 
    });

    return (
      <div className='levelInfo'>
        <h1>{`- ${this.props.title} -`}</h1>
        <p>{desLines}</p>
      </div>
    )
  }
}

export default LevelInfo
