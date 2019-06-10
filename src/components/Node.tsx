import React from "react";
import "../style/App.css";

import { BasicExecutionNode } from "../logic/node";
import { Directions } from "../logic/macros";
import { NullPort } from "../logic/port";

import NodeDisplay from "./NodeDisplay";
import Port from "./Port";

type NodeProps = {
  node: BasicExecutionNode;
};

class Node extends React.Component<NodeProps> {
  render() {
    const ports = this.props.node.getSrcPorts().reduce((ports, port, i) => {
      if (!(port instanceof NullPort))
        ports.push(<Port key={`port${i}`} direction={Directions[i]} value={port.getValue()} />);

      return ports;
    }, []);

    return (
      <div className="node" key={this.props.node.getID()}>
        <div className="editor">
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
          <input maxLength={16} type="text" />
        </div>
        <div className="info">
          <NodeDisplay tooltip="ACC" value={this.props.node.getACC()} />
          <NodeDisplay
            tooltip="BAK"
            value={"<" + this.props.node.getBAK() + ">"}
          />
          <NodeDisplay tooltip="LAST" value="N/A" />
          <NodeDisplay tooltip="MODE" value={this.props.node.getState()} />
        </div>
        {ports}
      </div>
    );
  }
}

export default Node;
