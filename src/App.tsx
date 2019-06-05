import React from 'react';
import './style/App.css';
import { Directions } from './logic/macros';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
            <p>{Directions.UP}</p>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
