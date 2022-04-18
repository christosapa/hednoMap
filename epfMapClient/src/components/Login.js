import React, {useRef, useState, useEffect } from 'react';
import './Login.css'

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(user, pwd)
        setUser('')
        setPwd('')
        setSuccess(true)
    }

    return (
        <section className='loginSection'>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    id="username"
                    placeholder='E-mail'
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
                <button className='signInButton'>Sign In</button>
            </form>
        </section>
    )
}

export default Login