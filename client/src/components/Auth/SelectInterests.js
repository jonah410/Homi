import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel, Grid } from '@mui/material';

const predefinedInterests = [
  "Hiking",
  "Music",
  "Cooking",
  "Reading",
  "Traveling",
  "Gaming",
  "Fitness",
  "Movies",
  "Art",
  "Dancing",
  "Soccer"
];

function SelectInterests() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customInterests, setCustomInterests] = useState(['']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInterestChange = (event) => {
    const value = event.target.value;
    setSelectedInterests((prev) => 
      prev.includes(value) ? prev.filter((interest) => interest !== value) : [...prev, value]
    );
  };

  const handleCustomInterestChange = (index, event) => {
    const newCustomInterests = [...customInterests];
    newCustomInterests[index] = event.target.value;
    setCustomInterests(newCustomInterests);
  };

  const addCustomInterest = () => {
    setCustomInterests([...customInterests, '']);
  };

  const getEmbedding = async (text) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      console.log(`Requesting embedding for: ${text}`);
      const response = await fetch(`https://homi-p50f.onrender.com/api/blitz/get-embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (!data.embeddings) {
        throw new Error('No embeddings found in response');
      }
      console.log(`Received embedding for: ${text}`);
      return data.embeddings;
    } catch (error) {
      console.error(`Error fetching embedding for "${text}":`, error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user.');
        setLoading(false);
        return;
      }

      const interests = [...selectedInterests, ...customInterests.filter((i) => i)];
      const embeddings = {};

      for (let interest of interests) {
        try {
          const embeddingResponse = await getEmbedding(interest);
          embeddings[interest] = embeddingResponse;
        } catch (error) {
          console.error(`Failed to generate embedding for "${interest}":`, error);
          alert(`Failed to generate embedding for "${interest}". Please try again.`);
          setLoading(false);
          return;
        }
      }

      await updateDoc(doc(db, 'users', user.uid), {
        interests, // Store interests as an array
        embeddings,
        profileComplete: true
      });

      console.log('Interests updated successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Failed to update interests:', error.message);
      alert('Failed to update interests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Select Your Interests
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {predefinedInterests.map((interest) => (
            <Grid item xs={6} key={interest}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedInterests.includes(interest)}
                    onChange={handleInterestChange}
                    value={interest}
                  />
                }
                label={interest}
              />
            </Grid>
          ))}
        </Grid>
        {customInterests.map((customInterest, index) => (
          <TextField
            key={index}
            fullWidth
            margin="normal"
            label="Custom Interest"
            value={customInterest}
            onChange={(e) => handleCustomInterestChange(index, e)}
          />
        ))}
        {customInterests.length < 10 && (
          <Button onClick={addCustomInterest}>Add Another Interest</Button>
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          Save Interests
        </Button>
      </form>
    </Container>
  );
}

export default SelectInterests;



