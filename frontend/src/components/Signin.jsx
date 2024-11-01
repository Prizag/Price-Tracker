import { useState } from 'react';
import axios from '../services/authServices';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/signin', formData);
            localStorage.setItem('token', response.data.token); 
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
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
                  name="Username"
                  placeholder="Username"
                  value={formData.Username}
                   onChange={handleChange} 
                  className="w-full p-2 text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="Email"
                  placeholder="Email"
                  value={formData.Email} 
                  onChange={handleChange} 
                  className="w-full p-2 text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="Password"
                  value={formData.password}
                   onChange={handleChange} 
                  placeholder="Password"
                  className="w-full p-2 text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </form>
          
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