import React from "react";
import "../style/App.css";

type NodeInputsProps = {
  instructions: string;
  updateInstructions: () => void;
};

class NodeInputs extends React.Component<NodeInputsProps> {
  private inputs: HTMLInputElement[] = [];

  private parseInstructions() : string[] {
    if(this.props.instructions == null)
      return [];
    
    return this.props.instructions.split("\n");
  }

  componentDidMount() {
    this.inputs.forEach((input, i) => {
      input.addEventListener("keydown", event => {
        if (event.key === "ArrowUp")
          this.inputs[i - 1 >= 0 ? i - 1 : this.inputs.length - 1].focus();

        if (event.key === "ArrowDown")
          this.inputs[i + 1 < this.inputs.length ? i + 1 : 0].focus();
      });

      input.addEventListener("focusout", _ => {
        this.props.updateInstructions();
      })
    });

  }

  componentDidUpdate() {
    let instructions : string[] = this.parseInstructions()
    
    this.inputs.forEach((input, i) => {
      input.value = this.props.instructions == null ? "" : instructions[i];
    });
  }

  getValue() : string {
    return this.inputs.reduce((string, input) => {
      return string += input.value.toUpperCase() + "\n";
    }, "")
  }

  render() {
    let inputs: JSX.Element[] = [];
    for (let i: number = 0; i < 13; i++)
      inputs.push(
        <input
          key={i}
          maxLength={16}
          type="text"
          ref={ref => this.inputs[i] = ref}
        />
      );

    return <div className="editor">{inputs}</div>;
  }
}

export default NodeInputs;
