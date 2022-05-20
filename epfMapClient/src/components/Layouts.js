import { Outlet } from "react-router-dom";
import '../App.css';
import React from 'react';
import Header from "./Header";

const Layout = () => {
    return (
        <main className='App'>
            <Header />
            <Outlet />
        </main>
    )
}

export default Layout