import React from "react";
import "../style/App.css";
import Button from "./Button";

type ControlPanelProps = {
};

class ControlPanel extends React.Component<ControlPanelProps> {
  render() {
    return (
      <div className="controlPanel">
        <div style={{flex: 1}}></div>
        <div className="buttons">
          <Button />
          <Button />
          <Button />
          <Button />
        </div>
      </div>
    );
  }
}

export default ControlPanel;
