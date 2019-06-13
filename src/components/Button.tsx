import React from "react"
import "../style/App.css"

type onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

type ButtonProps = {
  name: string
  onClick: onClick
}

class Button extends React.Component<ButtonProps> {
  render() {
    return (
      <button onClick={this.props.onClick}>
        <img />
        {this.props.name}
      </button>
    )
  }
}

export default Button
