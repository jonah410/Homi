import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, 'groups'), where('users', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        const userGroups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(userGroups);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user groups:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ textAlign: 'center', marginTop: '2rem' }}
      >
        My Groups
      </Typography>
      {groups.length > 0 ? (
        <List>
          {groups.map(group => (
            <ListItem button key={group.id} onClick={() => navigate(`/group-chat/${group.id}`)}>
              <ListItemText 
                primary={`Activity: ${group.task}`} 
                secondary="Click to enter the chat"
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" style={{ textAlign: 'center' }}>
          You are not part of any groups yet.
        </Typography>
      )}
    </Container>
  );
};

export default MyGroups;







