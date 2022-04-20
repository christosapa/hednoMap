import React from 'react'
import mainLogo from '../assets/logo_tr.png';
import './Header.css'
import { useNavigate } from 'react-router-dom';

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