import React, { useState } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(
        "http://localhost:3000/signup",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='shadow-md rounded-md border-2 p-6 md:w-96'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label htmlFor='username' className='block text-gray-700 text-sm font-bold mb-2'>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder='Enter Username'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2'>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Enter Email'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2'>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Enter Password'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className='flex items-center justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='submit'
            >
              Sign Up
            </button>
          </div>
          <p className='text-center mt-6'>Have an Account? <Link to='/login' className='text-blue-500 underline'>Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
