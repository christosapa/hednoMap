import React from 'react'
import './App.css';
import Layout from './components/Layouts';
import { Routes, Route } from 'react-router-dom';
import Maps from './components/MapsGMR'
import Welcome from './components/Welcome'
// import Login from './components/Login';
// import Signup from './components/Signup';
import RequireAuth from './components/RequireAuth';
import { DataProvider } from './context/DataContext';

export default function AppGMR() {
  return (
    <DataProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/hednoMap' element={<Maps />} />
          <Route path='/hednoMap/confirm/:confirmationCode' element={<Welcome />} />
          {/* <Route path='/hednoMap/login' element={<Login />} /> */}
          {/* <Route path='/hednoMap/signup' element={<Signup />} /> */}
          <Route element={<RequireAuth />}>
            <Route path='/hednoMapHome' element={<Maps />} />
          </Route>
        </Route>
      </Routes>
    </DataProvider>
  );
}