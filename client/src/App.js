import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import EditProfile from './components/Profile/EditProfile';
import GroupChat from './components/Groups/GroupChat';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './components/Auth/AuthPage';
import Header from './components/Header';
import SelectInterests from './components/Auth/SelectInterests';
import MyGroups from './components/Groups/MyGroups';
import MatchmakingStarted from './components/BlitzTools/MatchmakingStarted';
import MatchmakingError from './components/BlitzTools/MatchmakingError';
import About from './components/About';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingScreen from './components/LoadingScreen';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './GlobalStyle';
import theme from './theme';
import { auth } from './config/firebase';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      console.log('User logged in:', user);
    });

    return () => unsubscribe();
  }, []);

  const noHeaderRoutes = ['/', '/register', '/login', '/forgot-password', '/reset-password', '/register/interests'];
  const noFooterRoutes = ['/', '/register', '/login', '/forgot-password', '/reset-password', '/register/interests'];

  return (
    <LoadingProvider>
      <LoadingScreen />
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {!noHeaderRoutes.includes(location.pathname) && isLoggedIn && <Header />}
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/interests" element={<SelectInterests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/group-chat/:groupId" 
            element={
              <PrivateRoute>
                <GroupChat />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/my-groups" 
            element={
              <PrivateRoute>
                <MyGroups />
              </PrivateRoute>
            } 
          />
          <Route path="/matchmaking-started" element={<MatchmakingStarted />} />
          <Route path="/matchmaking-error" element={<MatchmakingError />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Wildcard route */}
        </Routes>
        {!noFooterRoutes.includes(location.pathname) && <Footer />}
      </ThemeProvider>
    </LoadingProvider>
  );
}

export default App;




