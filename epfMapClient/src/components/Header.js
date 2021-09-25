import React from "react"
import mainLogo from '../assets/logo.png';
import './Header.css'

const Header = () => {
    return (
        <nav>
            <div className='div-header'>
                <div className='div-logo'>
                    <img src={mainLogo} alt="logo" />
                </div>
                <div className='div-name'>
                    <h1>Faults and planned power interruptions</h1>
                </div>
            </div>
        </nav>
    )
}


export default Header