import React from 'react'
import '../style/App.css'

type onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

type ButtonProps = {
  name: string
  onClick: onClick
  image: string
}

class Button extends React.Component<ButtonProps> {
  render() {
    return (
      <button onClick={this.props.onClick}>
        <img src={this.props.image} alt='Button' />
        {this.props.name}
      </button>
    )
  }
}

export default Button
