import React from 'react'
import './App.css';
import Layout from './components/Layouts';
import { Routes, Route } from 'react-router-dom';
import Maps from './components/MapsGMR'
import Welcome from './components/Welcome'
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import { DataProvider } from './context/DataContext';

export default function AppGMR() {
  return (
    <DataProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/hednoMap' element={<Maps />} />
          <Route path='/hednoMap/confirm/:confirmationCode' element={<Welcome />} />
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path='/hednoMapHome' element={<Maps />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </DataProvider>
  );
}