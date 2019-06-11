import React from "react";
import "../style/App.css";

type NodeInputsProps = {};

class NodeInputs extends React.Component<NodeInputsProps> {
  private inputs: HTMLInputElement[] = [];

  componentDidMount() {
    this.inputs.forEach((input, i) => {
      input.addEventListener("keydown", event => {
        if (event.key === "ArrowUp") {
          this.inputs[i - 1 >= 0 ? i - 1 : this.inputs.length - 1].focus();
        }

        if (event.key === "ArrowDown") {
          this.inputs[i + 1 < this.inputs.length ? i + 1 : 0].focus();
        }
      });
    });
  }

  render() {
    let inputs: JSX.Element[] = [];
    for (let i: number = 0; i < 13; i++)
      inputs.push(
        <input key={i} maxLength={16} type="text" ref={ref => this.inputs.push(ref)} />
      );

    return <div className="editor">{inputs}</div>;
  }
}

export default NodeInputs;
