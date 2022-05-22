import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppGMR from './AppGMR';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/*" element={<AppGMR />} />
                </Routes>
            </AuthProvider>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
