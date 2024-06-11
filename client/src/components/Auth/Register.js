import React, { useState, useCallback } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone';
import { TextField, Button, Container, Typography, MenuItem, Box, CircularProgress, Backdrop } from '@mui/material';
import heic2any from 'heic2any';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const validateFileType = (file) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];
    return acceptedTypes.includes(file.type);
  };

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    const validFiles = acceptedFiles.filter(validateFileType);
    if (fileRejections.length > 0 || validFiles.length !== acceptedFiles.length) {
      alert('Please upload only JPEG, PNG, or JPG files.');
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
    try {
      const profilePicRef = ref(storage, `profile_pictures/temp`);
      await uploadBytes(profilePicRef, file);
      const url = await getDownloadURL(profilePicRef);
      setProfilePicUrl(url);
      setImageError(false);
      console.log('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setImageError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profilePicUrlToSave = profilePicUrl;

      if (profilePicUrl) {
        const profilePicRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(profilePicRef, profilePicUrl);
        profilePicUrlToSave = await getDownloadURL(profilePicRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        email,
        firstName,
        lastName,
        dob,
        phoneNumber,
        gender,
        profilePicUrl: profilePicUrlToSave,
        profileComplete: false,
        looking: false,
        location: {},
        interests: [],
        embeddings: {}
      });

      console.log("Registered successfully!");
      navigate('/register/interests', { state: { email, phoneNumber } });
    } catch (error) {
      console.error("Failed to register:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '5rem', textAlign: 'center' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister}>
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
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Gender"
          select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="nonbinary">Non-binary</MenuItem>
        </TextField>
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
            marginTop: '1rem'
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
          <Typography color="error">Image failed to load. Please ensure it is one of the supported file types.</Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          style={{ marginTop: '1.5rem' }}
        >
          Register
        </Button>
      </form>
      <Backdrop style={{ zIndex: 10, color: '#fff' }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default Register;






















