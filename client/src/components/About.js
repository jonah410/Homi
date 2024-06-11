import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import styled from 'styled-components';

const NormalText = styled(Typography)`
  text-transform: none !important; /* Override all caps */
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
            We understand that it can be tough for ideas to make it out of the groupchat. 
            But we encourage you to take initiative. 
            Be the one to start an SMS chat or coordinate a meetup.
          </NormalText>
          <NormalText variant="body1" paragraph>
            We don't want to become the source of your regular dopamine hits.
            So we don't offer any of the networking features that you might find on other social media platforms.
            It's also why we create your groups for you; there are no scrolling traps here. 
            Our goal is simply to help connect you with people—no gimmicks, no tricks. And definitely no reels.
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



