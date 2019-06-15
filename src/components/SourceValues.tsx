import React from 'react'
import '../style/App.css'

type SourceValueProps = {
  name: string
  values: number[]
}

class SourceValues extends React.Component<SourceValueProps> {
  render() {

    const values = this.props.values.map((value, i) => <p key={`value${i}`}>{value}</p>)

    return (
      <div className="sourceValues">
        <h2>{this.props.name}</h2>
        <div className="values">
          {values}
        </div>
      </div>
    )
  }
}

export default SourceValues
