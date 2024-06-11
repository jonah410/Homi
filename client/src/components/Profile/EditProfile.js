import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDropzone } from 'react-dropzone';
import {
  TextField,
  Button,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  IconButton,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import heic2any from 'heic2any';

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

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customInterests, setCustomInterests] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setDob(data.dob || '');
        setGender(data.gender || '');
        setSelectedInterests(data.interests.filter(interest => predefinedInterests.includes(interest)));
        setCustomInterests(data.interests.filter(interest => !predefinedInterests.includes(interest)));
        setProfilePicUrl(data.profilePicUrl || '');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

  const deleteCustomInterest = (index) => {
    const newCustomInterests = customInterests.filter((_, i) => i !== index);
    setCustomInterests(newCustomInterests);
  };

  const validateFileType = (file) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];
    return acceptedTypes.includes(file.type);
  };

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    const validFiles = acceptedFiles.filter(validateFileType);
    if (fileRejections.length > 0 || validFiles.length !== acceptedFiles.length) {
      alert('Please upload only JPEG, PNG, JPG, or HEIC files.');
      return;
    }

    if (validFiles.length > 0) {
      const file = validFiles[0];
      setLoading(true);

      if (file.type === 'image/heic') {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
          });
          const convertedFile = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' });
          await uploadProfilePic(convertedFile);
        } catch (error) {
          console.error('Error converting HEIC file:', error);
          setLoading(false);
        }
      } else {
        await uploadProfilePic(file);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/jpg, image/heic',
    maxFiles: 1
  });

  const uploadProfilePic = async (file) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user.');
      return;
    }

    try {
      const profilePicRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(profilePicRef, file);
      const url = await getDownloadURL(profilePicRef);
      setProfilePicUrl(url);

      await updateDoc(doc(db, 'users', user.uid), {
        profilePicUrl: url,
      });

      console.log('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedding = async (text) => {
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

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      const existingEmbeddings = docSnap.data().embeddings || {};
      
      const interests = [...selectedInterests, ...customInterests.filter((i) => i)];
      const embeddings = {};

      for (let interest of interests) {
        if (existingEmbeddings[interest]) {
          embeddings[interest] = existingEmbeddings[interest];
        } else {
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
      }

      await updateDoc(userDocRef, {
        firstName,
        lastName,
        dob,
        gender,
        interests, // Store interests as an array
        embeddings,
        profilePicUrl,
      });

      console.log('Profile updated successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Failed to update profile:', error.message);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ textAlign: 'center', marginTop: '2rem' }}>
          Edit Your Profile
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="nonbinary">Non-binary</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h6" component="h2" gutterBottom>
          Select Your Interests
        </Typography>
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
          <Box key={index} display="flex" alignItems="center">
            <TextField
              fullWidth
              margin="normal"
              label="Custom Interest"
              value={customInterest}
              onChange={(e) => handleCustomInterestChange(index, e)}
            />
            <IconButton onClick={() => deleteCustomInterest(index)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        {customInterests.length < 10 && (
          <Button onClick={addCustomInterest}>Add Another Interest</Button>
        )}
        <Box mt={3}>
          <Box
            {...getRootProps({ className: 'dropzone' })}
            textAlign="center"
            p={2}
            border="1px dashed #ccc"
            borderRadius="5px"
            style={{
              cursor: 'pointer',
              backgroundColor: isDragActive ? '#e0f7fa' : '#fafafa',
              transition: 'background-color 0.3s',
            }}
          >
            <input {...getInputProps()} />
            <Typography>Click to upload, or drag & drop a profile picture here! Accepted file types: .jpeg, .jpg, .png, .heic</Typography>
          </Box>
          {profilePicUrl && !imageError && (
            <img
              src={profilePicUrl}
              alt="Profile Pic"
              style={{ marginTop: '1rem', maxWidth: '100%' }}
              onError={() => setImageError(true)}
            />
          )}
          {imageError && (
            <Typography color="error">Image failed to load. Please check the URL.</Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
          >
            Save
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => navigate('/home')}
            style={{ marginTop: '1rem', backgroundColor: 'red' }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            style={{ marginTop: '1rem', backgroundColor: 'blue' }}
          >
            Logout
          </Button>
        </Box>
      </form>
      <Backdrop style={{ zIndex: 10, color: '#fff' }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default EditProfile;
















