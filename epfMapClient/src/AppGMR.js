import React from 'react'
import './App.css';
import Header from './components/Header';
import Maps from './components/MapsGMR';

export default function AppGMR() {
  return (
    <div className='App'>
      <Header />
      <Maps />
      <div className='LogIn-container'>
          <button
            className='LogIn'
            onClick={() => { // goto login page
            }}>
            Log in
          </button>

          <button
            className='SignUp'
            onClick={() => { // goto signup page
            }}>
            Sign up
          </button>
        </div>
    </div>
  );
}