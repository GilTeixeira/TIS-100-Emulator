import React from 'react'
import './style/App.css'

import { Tis100 } from './logic/tis_100'
import { levels } from './logic/level'

import NodeGrid from './components/NodeGrid'
import ControlPanel from './components/ControlPanel'
import { NullSink, NullSource } from './logic/node'

enum State {
  IDLE,
  RUN,
  FAST,
  ERROR
}

type AppState = {
  tis_100: Tis100
  state: State
  currentLevel: number
}

type AppProps = {}

class App extends React.Component<AppProps, AppState> {
  private interval

  constructor(props) {
    super(props)

    this.state = {
      tis_100: new Tis100(levels[0]),
      state: State.IDLE,
      currentLevel: 0
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
    this.state.tis_100.getGrid().forEach(row => {
      row.forEach(node => {
        console.log(node)
      })
    })
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
    this.checkEndLevel()
    this.refreshRender()

    this.state.tis_100
      .getGrid()
      .forEach(row => row.forEach(node => console.log(node)))
  }

  run() {
    if (this.state.state === State.ERROR) return

    if (this.state.state !== State.RUN) {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.state.tis_100.step()
        this.checkEndLevel()
        this.refreshRender()
      }, 500)
      this.setState(state => ({ ...state, state: State.RUN }))
    }
  }

  fast() {
    if (this.state.state === State.ERROR) return

    if (this.state.state !== State.FAST) {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.state.tis_100.step()
        this.checkEndLevel()
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

  checkEndLevel(): void {
    if (
      this.state.tis_100.getSinks().every(sink => {
        if (sink instanceof NullSink) return true
        else return sink.getOutputs().length >= 50
      })
    ) {
      this.compareResults()
      clearInterval(this.interval)
    }
  }

  compareResults(): boolean {
    let equalOutput: boolean = true

    let sinkOutputs = this.state.tis_100
      .getSinks()
      .filter(sink => !(sink instanceof NullSink))
      .map(sink => sink.getOutputs())

    let originalInputs = this.state.tis_100
      .getSources()
      .filter(source => !(source instanceof NullSource))
      .map(source => source.getOriginalInputs())

    let trueResults = this.state.tis_100.getLevel().transform(originalInputs)

    sinkOutputs.forEach((sinkArray, i) => {
      if (sinkArray !== null)
        sinkArray.forEach((value, e) => {
          if (trueResults[i][e] !== value) {
            equalOutput = false
          }
        })
    })

    if (equalOutput) {
      this.changeLevel()
    }

    return equalOutput
  }

  changeLevel() {
    if (this.state.currentLevel + 1 >= levels.length)
      this.setState(state => ({
        tis_100: new Tis100(levels[0]),
        state: State.IDLE,
        currentLevel: state.currentLevel + 1
      }))
    else
      this.setState(state => ({
        tis_100: new Tis100(levels[state.currentLevel + 1]),
        state: State.IDLE,
        currentLevel: state.currentLevel + 1
      }))
  }
}

export default App
