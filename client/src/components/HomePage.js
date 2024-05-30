import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import StartBlitzButton from './BlitzTools/StartBlitzButton'; // Update this to StartTouchGrassButton later
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '2rem',
  padding: '2rem',
  background: '#f5f5f5',
  borderRadius: '8px',
  textAlign: 'center', // Center content
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#2e7d32',
  textAlign: 'center', // Center text
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '1rem',
  padding: '1rem',
  fontSize: '1rem',
  textTransform: 'none',
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
    <StyledContainer maxWidth="md">
      <HeaderTypography variant="h2" gutterBottom>
        This is Homi
      </HeaderTypography>
      <Typography variant="body1" paragraph>
        Connecting you with like-minded people to explore, share, and create memorable experiences together.
        Whether you're new in town, looking to expand your social circle, or simply want to get out and engage with others,
        Homi is here to help you find your community.
        Let's make real connections, together.
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
              color="primary"
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
            <StartBlitzButton /> {/* Update to StartTouchGrassButton */}
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
              color="tertiary"
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









