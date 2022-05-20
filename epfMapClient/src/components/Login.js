import React, { useRef, useState, useEffect, useContext } from 'react';
import './Login.css'
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import DataContext from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = '/auth'

const Login = () => {

    const { setAuth } = useAuth()

    const navigate = useNavigate()

    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const {setSuccessfulLogin} = useContext(DataContext)
    const {setMenuUser} = useContext(DataContext)

    const loginSuccessful = () => {
      navigate('/hednoMapHome')
    }

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            setAuth({ user, pwd, roles, accessToken });
            setMenuUser(user)
            setUser('');
            setPwd('');
            setSuccessfulLogin(true);
            loginSuccessful();

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('User not found');
            } else if (err.response?.status === 402) {
                setErrMsg('Pending Account. Please Verify Your Email!');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section className='loginSection'>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1 className='loginHeader'>Log in</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="username"
                    placeholder='Email'
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <input
                    type="password"
                    id="password"
                    placeholder='Password'
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button className='signInButton'>Log in</button>
            </form>
        </section>
    )
}

export default Login