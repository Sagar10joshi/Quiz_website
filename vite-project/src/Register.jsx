import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import OTPVerification from './Otp';
import bgImage from './images/register.jpg';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Correctly defined here


    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(''); // Clear any previous error messages
        setSuccessMessage(''); // Clear any previous success messages

        // Check if fields are empty
        if (!username || !email || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        // Validate email domain
        if (!email.endsWith('@gehu.ac.in')) {
            setErrorMessage('Email must be a gehu.ac.in address.');
            return;
        }
        //const token = sessionStorage.getItem('token'); // Retrieve the token from storage
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`, // Include the token
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Registration successful!');
                sessionStorage.setItem('token', data.token);
                // Optionally reset fields or redirect
                if (data.redirect) {
                    navigate(data.redirect); // Navigate to OTP page
                }
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setErrorMessage(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Error occurred during OTP verification:', error); // Log the error
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <h1 style={styles.heading}>Create Account</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder='Min. length: 6 character'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Register</button>
                </form>

                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            </div>
        </div>
    );
}
// Inline styles
const styles = {
    body: {

        fontFamily: "'Arial', sans-serif",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${bgImage})`, // Using imported image
        position: "relative",
        overflow: "hidden",
        color: "white",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"

    },
    container: {
        background: 'rgb(93, 237, 225)',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        width: '300px',
        textAlign: 'center',
    },
    heading: {
        color: '#333',
        marginBottom: '20px',
    },
    form: {
        textAlign: 'left',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#666',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        transition: 'border-color 0.3s',
    },
    button: {
        background: '#ff7e5f',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        width: '100%',
    },
    errorMessage: {
        color: 'red',
        marginTop: '15px',
    },
};

// Export component
export default RegistrationPage;
