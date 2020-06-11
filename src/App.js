import React from 'react';
import Visualizer from './Visualizer/index.js';
import './App.css';

function App() {
  return (
    <div>
      <div className="App">
        <Visualizer />
      </div>
      <div className = "advLogo">
          <img className = "logo" src = "http://13.57.47.139/adventure-logo.png"/>
      </div>
    </div>
  );
}

export default App;