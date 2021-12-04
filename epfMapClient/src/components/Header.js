import React from 'react'
import { Component } from 'react';
import mainLogo from '../assets/logo_tr.png';
import mainLogo192 from '../assets/logo_tr192.png';
import './Header.css'

function reloadPage() {
    window.location.reload()
}

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    render() {
        const { width } = this.state;
        const isMobile = (width <= 600);
        if (isMobile) {
            return (
                <div className='div-logo'>
                    <img onClick={() => reloadPage()}
                        src={mainLogo} alt='logo' />
                </div>

            )
        }
        else {
            return (
                <div className='div-logo'>
                    <img onClick={() => reloadPage()}
                        src={mainLogo} alt='logo' />
                </div>

            )
        }
    }
}

export default Header;