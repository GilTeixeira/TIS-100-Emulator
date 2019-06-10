import React from "react";
import "./style/App.css";
import { Tis100 } from "./logic/tis_100";
import NodeGrid from "./components/NodeGrid";
import ControlPanel from "./components/ControlPanel";

class App extends React.Component {
  render() {
    const tis_100 = new Tis100(3, 2);

    return (
    <div className="app">
      <ControlPanel />
      <NodeGrid grid={tis_100.getGrid()} />
    </div>
    );
  }
}

export default App;
