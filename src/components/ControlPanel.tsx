import React from "react"
import "../style/App.css"

import Button from "./Button"

type onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

type ControlPanelProps = {
  onPlayClicked: onClick
  onStepClicked: onClick
}

class ControlPanel extends React.Component<ControlPanelProps> {
  render() {
    return (
      <div className="controlPanel">
        <div style={{ flex: 1 }}></div>
        <div className="buttons">
          <Button name="render" onClick={this.props.onPlayClicked} />
          <Button name="step" onClick={this.props.onStepClicked} />
        </div>
      </div>
    )
  }
}

export default ControlPanel
