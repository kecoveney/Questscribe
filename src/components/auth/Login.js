import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../data/authHandler';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Use this for redirection

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { username, password };
  
    login(user)
      .then((response) => {
        console.log("Login response:", response); // Debugging log to confirm response structure
  
        if (response.valid) {
          alert('Login successful!');
          localStorage.setItem('token', response.token);       // Save the token
          localStorage.setItem('user_id', response.id);        // Save user_id from response
          navigate('/'); // Redirect to home page
        } else {
          alert('Login failed: ' + (response.error || 'Unknown error'));
        }
      })
      .catch((error) => alert('Error logging in'));
  };
  
  


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
