import React from 'react'
import './App.css';
import Header from './components/Header';
import Maps from './components/MapsGMR';

export default function AppGMR() {
  return (
    <div className='App'>
      <Header />
      <Maps />
    </div>
  );
}