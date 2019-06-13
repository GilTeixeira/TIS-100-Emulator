import React from "react"
import "../style/App.css"

type PortProps = {
  direction: string
  value: number
}

class NodeDisplay extends React.Component<PortProps> {
  render() {
    return (
      <div className={"port " + this.props.direction}>
        <p className="arrow">{"=>"}</p>
        <p className="value">
          {this.props.value === undefined ? "?" : this.props.value}
        </p>
      </div>
    )
  }
}

export default NodeDisplay
