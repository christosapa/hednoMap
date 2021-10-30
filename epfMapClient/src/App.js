import React, { Component } from 'react'
import './App.css';
import Header from './components/Header';
import Maps from './components/Maps';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: '' };
  }

  callAPI() {
      fetch('https://hedno-map-api.herokuapp.com/locationsAPI')
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
      <div className='App'>
        <Header />
        <Maps markerLocation={this.state.apiResponse} />
      </div>
    );
  }
}


export default App;