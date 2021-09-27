import { render } from '@testing-library/react';
import React, { Component } from 'react'
import './App.css';
import Header from './components/Header';
import Maps from './components/Maps';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/locationsAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
    this.callAPI();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Maps markerLocation={this.state.apiResponse} />
      </div>
    );
  }
}


export default App;