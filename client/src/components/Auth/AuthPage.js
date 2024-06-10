import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../Logo.jpg';
import '../../styles/animations.css'; // Import the animations CSS

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideIn 1.3s ease-in-out;
`;

const AuthBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
  animation: slideIn 1.3s ease-in-out; /* Sync with Container */
`;

const AuthLogo = styled.img`
  width: 100px;
  margin-bottom: 20px;
`;

const AuthTitle = styled.h1`
  color: #4a4a4a;
`;

const AuthText = styled.p`
  color: #4a4a4a;
`;

const AuthButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
`;

const AuthButton = styled(Link)`
  flex: 1;
  border-radius: 20px;
  padding: 10px 20px;
  background-color: #00c6ff;
  color: white;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  font-family: 'Wedges', Arial, sans-serif; /* Use Wedges font */
  font-size: 1.2rem; /* Increase font size for better visibility */

  &:hover {
    background-color: #0B9FB8;
  }
`;

function AuthPage() {
  const buttonsRef = useRef([]);

  useEffect(() => {
    buttonsRef.current.forEach((button, index) => {
      button.style.animation = `bounce 1.5s ease-in-out ${1 + index * 0.1}s forwards`;
    });
  }, []);

  return (
    <Container className="slide-in">
      <AuthBox>
        <AuthLogo src={logo} alt="Homi Logo" />
        <AuthTitle>Welcome to Homi!</AuthTitle>
        <AuthText>Connect with people in real life based on shared interests.</AuthText>
        <AuthButtons>
          <AuthButton to="/register" ref={el => buttonsRef.current[0] = el} className="bounce">Register</AuthButton>
          <AuthButton to="/login" ref={el => buttonsRef.current[1] = el} className="bounce">Login</AuthButton>
          <AuthButton to="/about" ref={el => buttonsRef.current[2] = el} className="bounce">About</AuthButton>
        </AuthButtons>
      </AuthBox>
    </Container>
  );
}

export default AuthPage;










