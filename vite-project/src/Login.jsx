// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Correctly defined here

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        // navigate('/'); // Navigate to quiz page

        if (!username || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Logged in successful!');
                // const { token } = await response.json();
                sessionStorage.setItem('token', data.token);
                if (data.redirect) {
                    navigate(data.redirect); // Navigate to Quiz page
                }
                setSuccessMessage(data.message);
                // Optionally redirect or perform additional actions here
            } else {
                setErrorMessage(data.message || 'Login failed.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div id="body">
            <div className="container">
                <h1>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            </div>
        </div>
    );
}

export default LoginPage;
