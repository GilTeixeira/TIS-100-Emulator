import React from 'react'
import '../style/App.css'

import { Tis100 } from '../logic/tis_100'

import stop from '../images/stop.png'
import step from '../images/step.png'
import run from '../images/run.png'
import fast from '../images/fast.png'

import Button from './Button'
import LevelInfo from './LevelInfo'
import LevelValues from './LevelValues'

type onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

type ControlPanelProps = {
  tis_100: Tis100
  onStopClicked: onClick
  onRunClicked: onClick
  onStepClicked: onClick
  onFastClicked: onClick
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
          <Button name='stop' image={stop} onClick={this.props.onStopClicked} />
          <Button name='step' image={step} onClick={this.props.onStepClicked} />
          <Button name='run' image={run} onClick={this.props.onRunClicked} />
          <Button name='fast' image={fast} onClick={this.props.onFastClicked} />
        </div>
      </div>
    )
  }
}

export default ControlPanel
