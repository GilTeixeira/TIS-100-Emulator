import React from 'react'
import './style/App.css'

import { Tis100 } from './logic/tis_100'

import NodeGrid from './components/NodeGrid'
import ControlPanel from './components/ControlPanel'

type onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

type AppState = {
  tis_100: Tis100
}

type AppProps = {}

class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props)

    this.state = {
      tis_100: new Tis100(2, 2, [0], [0])
    }
  }

  render() {
    return (
      <div className='app'>
        <ControlPanel
          onPlayClicked={this.testClick.bind(this)}
          onStepClicked={this.step.bind(this)}
        />
        <NodeGrid grid={this.state.tis_100.getGrid()} sinks={this.state.tis_100.getSinks()}/>
      </div>
    )
  }

  refreshRender() {
    this.setState(state => state)
  }

  testClick() {
    this.refreshRender()
  }

  step() {
    this.state.tis_100.step()
    this.refreshRender()
  }
}

export default App
