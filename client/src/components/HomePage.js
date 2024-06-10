import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import StartBlitzButton from './BlitzTools/StartBlitzButton';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import '../styles/animations.css';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '2rem',
  padding: '2rem',
  background: '#f5f5f5',
  borderRadius: '8px',
  textAlign: 'center',
  animation: 'fadeIn 2s ease-in-out',
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#00c6ff',
  textAlign: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '1rem',
  padding: '1rem',
  fontSize: '1rem',
  textTransform: 'none',
  backgroundColor: '#00c6ff',
  color: '#fff',
  fontFamily: 'Wedges, Arial, sans-serif',
  '&:hover': {
    backgroundColor: '#0072ff',
  },
}));

const IconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.5rem',
}));

const PaperWrapper = styled(Paper)(({ theme }) => ({
  padding: '1.5rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const HomePage = () => {
  return (
    <StyledContainer maxWidth="md" className="fade-in">
      <HeaderTypography variant="h2" gutterBottom>
        This is Homi
      </HeaderTypography>
      <Typography variant="body1" paragraph>
        Connecting you with like-minded people to explore, share, and create memorable experiences together.
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <PaperWrapper>
            <IconWrapper>
              <PersonIcon fontSize="large" />
            </IconWrapper>
            <Typography variant="h6">View Profile</Typography>
            <StyledButton
              component={Link}
              to="/profile"
              variant="contained"
              fullWidth
            >
              Go to Profile
            </StyledButton>
          </PaperWrapper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <PaperWrapper>
            <IconWrapper>
              <TravelExploreIcon fontSize="large" />
            </IconWrapper>
            <Typography variant="h6">Find A Group</Typography>
            <StartBlitzButton />
          </PaperWrapper>
        </Grid>
        <Grid item xs={12}>
          <PaperWrapper>
            <IconWrapper>
              <GroupsIcon fontSize="large" />
            </IconWrapper>
            <Typography variant="h6">My Groups</Typography>
            <StyledButton
              component={Link}
              to="/my-groups"
              variant="contained"
              fullWidth
            >
              View Groups
            </StyledButton>
          </PaperWrapper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default HomePage;











