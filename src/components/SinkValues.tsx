import React from 'react'
import '../style/App.css'

type SinkValueProps = {
  name: string,
  objectiveValues: number[]
  values: number[]
}

class SinkValues extends React.Component<SinkValueProps> {
  render() {

    const objectiveValues = this.props.objectiveValues.map((value, i) => <p key={`value${i}`}>{value}</p>)
    const values = this.props.values.map((value, i) => <p key={`value${i}`}>{value}</p>)

    return (
      <div className="sinkValues">
        <h2>{this.props.name}</h2>
        <div>
          <div className="objectiveValues">
            {objectiveValues}
          </div>
          <div className="values">
            {values}
          </div>
        </div>
      </div>
    )
  }
}

export default SinkValues
