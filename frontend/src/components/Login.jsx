/* eslint-disable react/no-unescaped-entities */
import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/authServices.jsx'
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
const Login = () => {
    const [formData, setFormData] = useState({email:'',password:''})
    const [error, setError] = useState('')
    const navigate = useNavigate()
  
    const handleChange = (e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }
  
    const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
        const response = await axios.post('/login',formData)
        localStorage.setItem('token',response.data.token)
        navigate('/dashboard')
      } catch (err) {
        console.log(err.response.data)
        setError(err.response?.data?.message || 'Login failed');
      }
    }
    
      const handleLoginSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        try {
            // Send the Google token to the backend
            const response = await fetch('http://localhost:3000/api/auth/google/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credential }),
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
            <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/Signin" className="text-blue-500 hover:underline">
              Create One!
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-gray-500">OR</p>
          <p>
<GoogleLogin
  onSuccess={handleLoginSuccess}
  onError={() => {
    console.log('Login Failed');
  }}
/></p>
          </div>
  
          {/* Right side - Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-1/3 bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900"
          >
            <span className="text-xl font-semibold tracking-widest">LOGIN</span>
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      )
    }
    
    export default Login  