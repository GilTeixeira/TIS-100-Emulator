import React from "react";
import "../style/App.css";
import { BasicExecutionNode } from "../logic/node";
import NodeDisplay from "./NodeDisplay";

type NodeProps = {
  node: BasicExecutionNode;
};

class Node extends React.Component<NodeProps> {
  render() {
    return (
      <div className="node" key={this.props.node.getID()}>
        <div className="editor">
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
          <input type="text"/>
        </div>
        <div className="info">
          <NodeDisplay tooltip="ACC" value={this.props.node.getACC()}/>
          <NodeDisplay tooltip="BAK" value={"<" + this.props.node.getBAK() + ">"}/>
          <NodeDisplay tooltip="LAST" value="N/A"/>
          <NodeDisplay tooltip="MODE" value={this.props.node.getState()}/>
        </div>
      </div>
    );
  }
}

export default Node;
