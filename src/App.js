import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import HilbertMorph from './HilbertMorph.js'

class App extends Component {
  render() {
    const rules = ["+RF-LFL-FR+", "-LF+RFR+FL"]
    //  var rules = {L: "+RF-LFL-FR+", R: "-LF+RFR+FL"}
    return (
      <div className="App">
        <HilbertMorph
            begin_iteration="2"
            end_iteration="7"
            duration="3000"
            end="reverse"
            rules={rules}
        />
      </div>
    );
  }
}

export default App;
