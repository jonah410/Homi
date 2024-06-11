import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Container, List, ListItem, ListItemText, TextField, Button, Typography, Paper, Avatar, ListItemAvatar, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import styled from 'styled-components';

const NormalText = styled(Typography)`
  text-transform: none !important; /* Override all caps */
`;

const GroupChat = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupTask, setGroupTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!groupId) return;

    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
      setLoading(false);

      // Fetch user names for each message
      const userIds = [...new Set(fetchedMessages.map(message => message.userId))];
      const userNamesMap = {};
      await Promise.all(userIds.map(async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userNamesMap[userId] = `${userData.firstName} ${userData.lastName ? userData.lastName.charAt(0) : ''}`;
        }
      }));
      setUserNames(userNamesMap);
    });

    const fetchGroupData = async () => {
      try {
        const groupDocRef = doc(db, 'groups', groupId);
        const groupDocSnap = await getDoc(groupDocRef);
        if (groupDocSnap.exists()) {
          const groupData = groupDocSnap.data();
          const memberPromises = groupData.users.map(uid => getDoc(doc(db, 'users', uid)));
          const memberDocs = await Promise.all(memberPromises);
          const members = memberDocs.map(doc => ({ id: doc.id, ...doc.data() }));
          setGroupMembers(members);
          setGroupTask(groupData.task); // Set the group task

          // Store user names in state for quick lookup
          const names = {};
          members.forEach(member => {
            names[member.id] = `${member.firstName} ${member.lastName ? member.lastName.charAt(0) : ''}`;
          });
          setUserNames(prevNames => ({ ...prevNames, ...names }));
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();

    return () => unsubscribe();
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messagesRef = collection(db, 'groups', groupId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      userId: user.uid,
      timestamp: serverTimestamp(),
    });
    setNewMessage('');
  };

  const getUserProfilePic = (userId) => {
    const member = groupMembers.find(member => member.id === userId);
    return member ? member.profilePicUrl : '';
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseDialog = () => {
    setSelectedMember(null);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Box textAlign="center" mt={4} mb={2}>
        <NormalText variant="h4" gutterBottom>
          Group Chat
        </NormalText>
      </Box>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <NormalText variant="h6">Group Members</NormalText>
        {groupMembers.length > 0 ? (
          groupMembers.map(member => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Avatar 
                src={member.profilePicUrl} 
                onClick={() => handleMemberClick(member)} 
                style={{ cursor: 'pointer', marginRight: '10px' }}
              />
              <NormalText>{member.firstName} {member.lastName ? member.lastName.charAt(0) : ''}.</NormalText>
            </div>
          ))
        ) : (
          <NormalText>No group members found.</NormalText>
        )}
      </Paper>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <NormalText variant="h6">Activity:</NormalText>
        <NormalText>{groupTask}</NormalText>
      </Paper>
      <List>
        {messages.map(message => (
          <ListItem key={message.id}>
            <ListItemAvatar>
              <Avatar src={getUserProfilePic(message.userId)} />
            </ListItemAvatar>
            <ListItemText 
              primary={<NormalText>{message.text}</NormalText>}
              secondary={userNames[message.userId] || message.userId} 
            />
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message here..."
        variant="outlined"
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginTop: '10px' }}>
        Send
      </Button>

      <Dialog open={Boolean(selectedMember)} onClose={handleCloseDialog}>
        {selectedMember && (
          <>
            <DialogTitle>{selectedMember.firstName} {selectedMember.lastName}</DialogTitle>
            <DialogContent>
              <NormalText variant="h6">Interests</NormalText>
              <NormalText>{selectedMember.interests ? selectedMember.interests.join(', ') : 'No interests provided'}</NormalText>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default GroupChat;











