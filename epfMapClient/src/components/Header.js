import React from 'react'
import mainLogo from '../assets/logo.png';
import './Header.css'

function reloadPage() {
    window.location.reload()
}

const Header = () => {
    return (
        <nav>
            <div className='div-header'>
                <div className='div-logo'>
                    <img onClick={() => reloadPage()}
                        src={mainLogo} alt='logo' />
                </div>
                <div className='div-name'>
                    <h1>Live and planned power outages.</h1>
                </div>
            </div>
        </nav>
    )
}


export default Header