import React from 'react'
import '../style/App.css'

import { transform } from '../logic/level'
import { Source, Sink, NullSource, NullSink } from '../logic/node'

import SourceValues from './SourceValues'
import SinkValues from './SinkValues'

type LevelValueProps = {
  sources: Source[]
  sinks: Sink[]
  transform: transform
}

class LevelValues extends React.Component<LevelValueProps> {
  render() {
    const sources = this.props.sources
      .filter(source => !(source instanceof NullSource))
      .map((source, i) => (
        <SourceValues
          key={`source${i}`}
          name={`IN.${source.getID()}`}
          values={source.getOriginalInputs()}
        />
      ))

    const objectiveValues = this.props.transform(
      this.props.sources
        .filter(source => !(source instanceof NullSource))
        .map(source => source.getOriginalInputs())
    )

    const sinks = this.props.sinks
      .filter(sink => !(sink instanceof NullSink))
      .map((sink, i) => (
        <SinkValues
          key={`sink${i}`}
          name={`OUT.${sink.getID()}`}
          values={sink.getOutputs()}
          objectiveValues={objectiveValues[i]}
        />
      ))

    return <div className='levelValues'>{[...sources, ...sinks]}</div>
  }
}

export default LevelValues
