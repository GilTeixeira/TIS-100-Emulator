import React from 'react'
import './style/App.css'

import { Tis100 } from './logic/tis_100'
import { level1, level2, level3 } from './logic/level'

import NodeGrid from './components/NodeGrid'
import ControlPanel from './components/ControlPanel'
import { CommandParser } from './logic/command_parser';
import { Source, Sink, NullSource, NullSink } from './logic/node'

enum State {
  IDLE,
  RUN,
  FAST,
  ERROR
}

type AppState = {
  tis_100: Tis100
  state: State
}

type AppProps = {}

class App extends React.Component<AppProps, AppState> {
  private interval
  private nextLevelTreshold : number = 10
  private levels = {level2, level3}
  private levelIndex = 1

  constructor(props) {
    super(props)

    this.state = {
      tis_100: new Tis100(level1),
      state: State.IDLE
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
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
          state={this.state.tis_100.getState()}
          setErrorState={this.setErrorState.bind(this)}
        />
      </div>
    )
  }

  refreshRender() {
    this.setState(state => state)
  }

  stop() {
    if (this.state.state === State.ERROR) return

    if (this.state.state !== State.IDLE) {
      this.setState(state => ({ ...state, state: State.IDLE }))
      clearInterval(this.interval)
    }

    this.state.tis_100.stop()
    this.refreshRender()
  }

  step() {
    if (this.state.state === State.ERROR) return

    if (this.state.state !== State.IDLE) {
      this.setState(state => ({ ...state, state: State.IDLE }))
      clearInterval(this.interval)
    }

    this.state.tis_100.step()
    this.refreshRender()
  }

  run() {
    if (this.state.state === State.ERROR) return

    if (this.state.state !== State.RUN) {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.state.tis_100.step()
        
        let outputs = this.state.tis_100.getSinks()[0].getOutputs()

        if((outputs.length === this.nextLevelTreshold) && this.compareResults(outputs)){
          
          clearInterval(this.interval)
          this.changeLevel()
        }

        this.refreshRender()
      }, 100)
      this.setState(state => ({ ...state, state: State.RUN }))
    }
  }

  fast() {
    if (this.state.state === State.ERROR) return

    if (this.state.state !== State.FAST) {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.state.tis_100.step()
        this.refreshRender()
      }, 10)
      this.setState(state => ({ ...state, state: State.FAST }))
    }
  }

  setErrorState(error: boolean) {
    this.setState(state => ({
      ...state,
      state: error ? State.ERROR : State.IDLE
    }))
  }

  compareResults(outputs: number[]): boolean{

    let equalOutput: boolean = true

    let originalInput = this.state.tis_100.getSources()[0].getOriginalInputs()
    let trueOutput : number[][] = []
    trueOutput.push(originalInput)
    let trueResults = this.state.tis_100.getLevel().transform(trueOutput)[0]
  
    outputs.forEach((element, ind) => {
      if (trueResults[ind] !== element) {
        equalOutput = false
      }
    })

    return equalOutput
  }

  changeLevel(){
    this.setState({
      tis_100: new Tis100(this.levels[this.levelIndex++]),
      state: State.IDLE
      }
    )
    
    this.refreshRender()
  }
}

export default App
