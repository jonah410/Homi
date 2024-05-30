import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Box mt={4} mb={4}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h4" gutterBottom>
            About Homi
          </Typography>
          <Typography variant="body1" paragraph>
            Hi there! We're thrilled that you're here. 
          </Typography>
          <Typography variant="body1" paragraph>
            Since the COVID-19 pandemic, social isolation has surged. 
            At Homi, we are dedicated to combating this trend. 
            We connect you with others by forming groups of 3-5 based on your age, location, and shared interests, and assign you an activity to do together. 
          </Typography>
          <Typography variant="body1" paragraph>
            We understand that can be tough to bring ideas out of the group chat phase. 
            But we encourage you to take the initiative. 
            Be the one to the SMS chat or coordinate a meetup. Trust us—no one will think you're lame for showing interest.
          </Typography>
          <Typography variant="body1" paragraph>
            Our goal is not to become the source of your regular dopamine hits.
            So we don't offer features common to most social media platforms.
            It's also why we make the groups for you; there will be no doomscrolling here. 
            We want you to get out and live life—REAL life. Connect in person, make memories, and enjoy meaningful interactions.
          </Typography>
        </Paper>
        <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          About the Creator
        </Typography>
        <Typography variant="body1" paragraph>
          You can view my personal website <a href="https://adaptive-guide-68e.notion.site/Hi-I-m-Jonah-c96647ac5f6640e1a2f52581b0ed26f7" target="_blank" rel="noopener noreferrer">here</a>
        </Typography>
      </Paper>
      </Box>
    </Container>
  );
};

export default About;

