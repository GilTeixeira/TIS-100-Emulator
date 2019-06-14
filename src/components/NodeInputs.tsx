import React from 'react'
import '../style/App.css'

import { BasicExecutionNode } from '../logic/node'
import { Status } from '../logic/macros'

type NodeInputsProps = {
  instructions: string
  updateInstructions: () => void
  node: BasicExecutionNode
}

class NodeInputs extends React.Component<NodeInputsProps> {
  private inputs: HTMLInputElement[] = []

  private parseInstructions(): string[] {
    if (this.props.instructions == null) return []

    return this.props.instructions.split('\n')
  }

  componentDidMount() {
    this.inputs.forEach((input, i) => {
      input.addEventListener('keydown', event => {
        let prevSelection = input.selectionStart

        if (event.key === 'ArrowUp') {
          this.inputs[
            i - 1 >= 0 ? i - 1 : this.inputs.length - 1
          ].setSelectionRange(prevSelection, prevSelection)
          this.inputs[i - 1 >= 0 ? i - 1 : this.inputs.length - 1].focus()
        }

        if (event.key === 'ArrowDown') {
          this.inputs[i + 1 < this.inputs.length ? i + 1 : 0].setSelectionRange(
            prevSelection,
            prevSelection
          )
          this.inputs[i + 1 < this.inputs.length ? i + 1 : 0].focus()
        }

        if (event.key === 'Enter' && i < this.inputs.length - 1) {
          for (let j: number = this.inputs.length - 1; j > i + 1; j--)
            this.inputs[j].value = this.inputs[j - 1].value

          this.inputs[i + 1].value = input.value.slice(prevSelection)
          input.value = input.value.slice(0, prevSelection)

          this.inputs[i + 1].focus()
          this.inputs[i + 1].setSelectionRange(prevSelection, prevSelection)
        }
      })

      input.addEventListener('focusout', _ => {
        this.props.updateInstructions()
      })
    })
  }

  componentDidUpdate() {
    let instructions: string[] = this.parseInstructions()

    this.inputs.forEach((input, i) => {
      input.value = this.props.instructions == null ? '' : instructions[i]
    })
  }

  getValue(): string {
    return this.inputs.reduce((string, input) => {
      return (string += input.value.toUpperCase() + '\n')
    }, '')
  }

  render() {
    let inputs: JSX.Element[] = []
    for (let i: number = 0; i < 13; i++)
      inputs.push(
        <input
          className={
            this.props.node.getInstructionIndex() === null ||
            this.props.node.getInstructionIndex() !== i
              ? ''
              : this.props.node.getState() === Status.WRTE || this.props.node.getState() === Status.READ
              ? 'blocked'
              : 'selected'
          }
          key={i}
          maxLength={16}
          type='text'
          ref={ref => (this.inputs[i] = ref)}
        />
      )

    return <div className='editor'>{inputs}</div>
  }
}

export default NodeInputs
