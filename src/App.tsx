import React from "react";
import "./style/App.css";
import { Tis100 } from "./logic/tis_100";
import Node from "./components/Node";

class App extends React.Component {
  render() {
    const tis_100 = new Tis100(4, 4);

    let grid = tis_100.getGrid().map(gridRow => {
      let nodes = gridRow.map(node => <Node node={node} />);

      return <div>{nodes}</div>;
    });

    return <div className="App"><Node node={tis_100.getGrid()[0][0]} /></div>;
  }
}

export default App;
