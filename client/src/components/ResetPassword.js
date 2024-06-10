import React, { useState } from 'react';
import { confirmPasswordReset } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useLoading } from '../contexts/LoadingContext';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoading, hideLoading } = useLoading();

    const query = new URLSearchParams(location.search);
    const oobCode = query.get('oobCode');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        showLoading();
        setMessage('');
        setError('');
        try {
            await confirmPasswordReset(auth, oobCode, password);
            setMessage('Password has been reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error("Error resetting password:", error.message);
            setError('Failed to reset password');
        } finally {
            hideLoading();
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '5rem', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Reset Password
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
                <form onSubmit={handleResetPassword} style={{ width: '100%', marginTop: '1rem' }}>
                    <TextField
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        variant="outlined"
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
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
                        Reset Password
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default ResetPassword;
