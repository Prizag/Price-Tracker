import { useState } from 'react';
import axios from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
      console.log(formData)
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/signup', formData);
            localStorage.setItem('token', response.data.token); 
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    
    const handleLoginSuccess = async (credentialResponse) => {
      const { credential } = credentialResponse;

      try {
        const username = prompt('Enter your username (Atleast 3 character long):');
        if (!username || username.length<3) {
          alert('Username is required!');
          return; // Exit the function if username is not provided
      }
            const password = prompt('Enter your password (Atleast 6 character long):');
            if (!password || password.length<6) {
              alert('Password is required!');
              return; // Exit the function if username is not provided
          }
          // Send the Google token to the backend
          const response = await fetch('http://localhost:3000/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: credential,
                username,
                password
               }),
          });

          const data = await response.json();

          if (response.ok) {
              console.log('User Verified and Token Generated:', data);
              // Example: Save the generated token in localStorage
              localStorage.setItem('token', data.accessToken);
              navigate('/dashboard');
          } else {
              console.error('Authentication Failed:', data.error);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  };
  

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300">
        <div className="flex w-96 shadow-lg">
          {/* Left side - Form */}
          <div className="flex flex-col w-2/3 p-8 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                   onChange={handleChange} 
                  className="w-full p-2 text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full p-2 text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                   onChange={handleChange} 
                  placeholder="Password"
                  className="w-full p-2 text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </form>
          <p> <GoogleLogin
  onSuccess={handleLoginSuccess}
  onError={() => {
    console.log('Signup Failed');
  }}
  useOneTap
/> </p>
          </div>
  
          {/* Right side - Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-1/3 bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900"
          >
            <span className="text-xl font-semibold tracking-widest">SIGNUP</span>
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
};

export default Signup;