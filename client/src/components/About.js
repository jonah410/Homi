import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import styled from 'styled-components';

const NormalText = styled(Typography)`
  text-transform: none; /* Override all caps */
`;

const About = () => {
  return (
    <Container>
      <Box mt={4} mb={4}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <NormalText variant="h4" gutterBottom>
            About Homi
          </NormalText>
          <NormalText variant="body1" paragraph>
            Hi there! We're thrilled that you're here. 
          </NormalText>
          <NormalText variant="body1" paragraph>
            Since the COVID-19 pandemic, social isolation has surged. 
            At Homi, we are dedicated to combating this trend. 
            We connect you with others by forming groups of 3-5 based on your age, location, and shared interests, and assign you an activity to do together. 
          </NormalText>
          <NormalText variant="body1" paragraph>
            We understand that it can be tough to bring ideas out of the group chat phase. 
            But we encourage you to take the initiative. 
            Be the one to send the SMS chat or coordinate a meetup. Trust us, no one will think you're lame for showing interest.
          </NormalText>
          <NormalText variant="body1" paragraph>
            Our goal is not to become the source of your regular dopamine hits.
            So we don't offer features common to most social media platforms.
            It's also why we find your groups for you; there are no doomscrolling traps here. 
            We want you getting out and enjoying life—REAL life. Connect in person, make memories, and enjoy meaningful interactions.
          </NormalText>
        </Paper>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <NormalText variant="h4" gutterBottom>
            About the Creator
          </NormalText>
          <NormalText variant="body1" paragraph>
            You can view my personal website <a href="https://jonahblack.notion.site/" target="_blank" rel="noopener noreferrer">here</a>
          </NormalText>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;


