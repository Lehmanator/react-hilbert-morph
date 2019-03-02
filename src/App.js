import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Hilbert from './Hilbert.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Hilbert iterations="6" duration="3000" />
      </div>
    );
  }
}

export default App;
