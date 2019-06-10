import React from "react";
import "../style/App.css";

type ControlPanelProps = {
};

class ControlPanel extends React.Component<ControlPanelProps> {
  render() {
    return (
      <div className="controlPanel">
        <div></div>
        <div className="buttons"></div>
      </div>
    );
  }
}

export default ControlPanel;
