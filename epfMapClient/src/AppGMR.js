import React from 'react'
import './App.css';
import Layout from './components/Layouts';
import { Routes, Route } from 'react-router-dom';
import Maps from './components/MapsGMR'
import Login from './components/Login';
import Signup from './components/Signup';

export default function AppGMR() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/hednoMap' element={<Maps />} />
        <Route path='/hednoMap/login' element={<Login />} />
        <Route path='/hednoMap/signup' element={<Signup />} />
      </Route>
    </Routes>
  );
}