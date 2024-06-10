import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useLoading } from '../contexts/LoadingContext';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        showLoading();
        setMessage('');
        setError('');
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error("Error sending password reset email:", error.message);
            setError('Failed to send password reset email');
        } finally {
            hideLoading();
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '5rem', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Forgot Password
                </Typography>
                {message && (
                    <Typography variant="body1" color="success" gutterBottom>
                        {message}
                    </Typography>
                )}
                {error && (
                    <Typography variant="body1" color="error" gutterBottom>
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleForgotPassword} style={{ width: '100%', marginTop: '1rem' }}>
                    <TextField
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        variant="outlined"
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '1.5rem' }}
                    >
                        Send Password Reset Email
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default ForgotPassword;
