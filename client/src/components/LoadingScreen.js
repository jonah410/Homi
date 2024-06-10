import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';
import { useLoading } from '../contexts/LoadingContext';

const LoadingScreen = () => {
  const { isLoading } = useLoading();

  return (
    <Backdrop open={isLoading} style={{ zIndex: 10000, color: '#fff' }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingScreen;
