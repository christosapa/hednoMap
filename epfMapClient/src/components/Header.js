import React from 'react'
import { Component } from 'react';
import mainLogo from '../assets/logo_tr.png';
import mainLogo192 from '../assets/logo_tr192.png';
import './Header.css'
import { useNavigate } from 'react-router-dom';

function reloadPage() {
    window.location.reload()
}

const Header = () => {

    const navigate = useNavigate()
    const homePage = () => {
        navigate('/hednoMap')
    }

    return (
        <div className='div-logo'>
            <img onClick={homePage}
                src={mainLogo} alt='logo' />
        </div>
    )
}

export default Header;