import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import theme from './theme';


function App() {
  const location = useLocation();
  const authRoutes = ['/', '/register', '/login'];

  return (
    <>
      {!authRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/interests" element={<SelectInterests />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
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
      </Routes>
    </>
  );
}

export default App;