import React from 'react'
import '../style/App.css'

import { BasicExecutionNode } from '../logic/node'
import { Directions } from '../logic/macros'
import { NullPort } from '../logic/port'

import NodeDisplay from './NodeDisplay'
import NodeInputs from './NodeInputs'
import Port from './Port'

type error = {
  line: number
  startColumn: number
  endColumn: number
  token: string
}

type setErrorState = (error: boolean) => void

type NodeState = {
  error: error
}

type NodeProps = {
  node: BasicExecutionNode
  locked: boolean
  setErrorState: setErrorState
}


class Node extends React.Component<NodeProps, NodeState> {
  private nodeInputs: NodeInputs

  constructor(props) {
    super(props)
    this.state = {
      error: null
    }
  }

  render() {
    const ports = this.props.node.getSrcPorts().reduce((ports, port, i) => {
      if (!(port instanceof NullPort))
        ports.push(
          <Port
            key={`port${i}`}
            direction={Directions[i]}
            value={port.getValue()}
          />
        )

      return ports
    }, [])

    return (
      <div className='node' key={this.props.node.getID()}>
        {this.state.error && (
          <div className='errorMessage'>
            <p>{`INVALID TOKEN "${this.state.error.token.toUpperCase()}"`}</p>
          </div>
        )}
        <NodeInputs
          node={this.props.node}
          instructions={this.props.node.getInstructions()}
          locked={this.props.locked}
          updateInstructions={this.updateInstructions.bind(this)}
          ref={ref => (this.nodeInputs = ref)}
        />
        <div className='info'>
          <NodeDisplay tooltip='ACC' value={this.props.node.getACC()} />
          <NodeDisplay tooltip='BAK' value={`<${this.props.node.getBAK()}>`} />
          <NodeDisplay tooltip='LAST' value='N/A' />
          <NodeDisplay tooltip='MODE' value={this.props.node.getState()} />
        </div>
        {ports}
      </div>
    )
  }

  updateInstructions() {
    try {
      this.props.node.setInstructions(this.nodeInputs.getValue())
      this.setState(_ => ({ error: null }))
      this.props.setErrorState(false)
    } catch (e) {
      const newError: error = {
        line: e.token.startLine - 1,
        startColumn: e.token.startColumn - 1,
        endColumn: e.token.endColumn,
        token: this.nodeInputs
          .getValueIndex(e.token.startLine - 1)
          .substring(e.token.startColumn - 1, e.token.endColumn)
      }
      this.setState(_ => ({ error: newError }))
      this.props.setErrorState(true)
    }
  }
}

export default Node
