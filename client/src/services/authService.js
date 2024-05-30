// client/src/services/authService.js
import axios from 'axios';

const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/users/login', { email, password });
    const { token } = response.data;

    // Store the token in localStorage or a global state
    localStorage.setItem('token', token);
    console.log("Login successful!");
  } catch (error) {
    console.error("Login failed:", error.response.data.error);
  }
};

export default loginUser;
