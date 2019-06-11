import React from "react";
import "../style/App.css";

type ButtonProps = {
};

class Button extends React.Component<ButtonProps> {
  render() {
    return (
      <button>
        <img></img>
        {"Play"}
      </button>
    );
  }
}

export default Button;
