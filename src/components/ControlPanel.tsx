import React from 'react'
import '../style/App.css'

import { Tis100 } from '../logic/tis_100'

import Button from './Button'
import LevelInfo from './LevelInfo'
import LevelValues from './LevelValues'

type onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

type ControlPanelProps = {
  tis_100: Tis100
  onPlayClicked: onClick
  onStepClicked: onClick
}

class ControlPanel extends React.Component<ControlPanelProps> {
  render() {
    return (
      <div className='controlPanel'>
        <LevelInfo
          title={this.props.tis_100.getLevel().title}
          description={this.props.tis_100.getLevel().description}
        />
        <LevelValues
          sources={this.props.tis_100.getSources()}
          sinks={this.props.tis_100.getSinks()}
          transform={this.props.tis_100.getLevel().transform}
        />
        <div className='buttons'>
          <Button name='render' onClick={this.props.onPlayClicked} />
          <Button name='step' onClick={this.props.onStepClicked} />
        </div>
      </div>
    )
  }
}

export default ControlPanel
