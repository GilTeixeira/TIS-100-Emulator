import React from 'react'
import './style/App.css'

import { Tis100 } from './logic/tis_100'
import { level1 } from './logic/level'

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
      tis_100: new Tis100(level1)
    }
  }

  render() {
    return (
      <div className='app'>
        <ControlPanel
          tis_100={this.state.tis_100}
          onStopClicked={this.stop.bind(this)}
          onStepClicked={this.step.bind(this)}
          onRunClicked={this.run.bind(this)}
          onFastClicked={this.fast.bind(this)}
        />
        <NodeGrid
          grid={this.state.tis_100.getGrid()}
          sinks={this.state.tis_100.getSinks()}
          sources={this.state.tis_100.getSources()}
        />
      </div>
    )
  }

  refreshRender() {
    this.setState(state => state)
  }

  stop() {
    this.refreshRender()
  }

  step() {
    this.state.tis_100.step()
    this.refreshRender()
  }

  run() {}

  fast() {}
}

export default App
