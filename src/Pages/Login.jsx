import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase'; // Adjust path as needed

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('User Info:', user);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        alert('Login failed. Please try again.');
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome</h1>
        <p className="text-gray-600 mb-6">Sign in to continue</p>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#fbc02d"
              d="M43.6 20.4H42V20H24v8h11.3C33.2 32.4 29.1 35 24 35c-6.1 0-11.1-4.6-12.3-10.6L8 27c1.9 8 9 14 16 14 9.2 0 16.5-7.5 16.5-16.5 0-1.1-.1-2.1-.4-3.1z"
            />
            <path
              fill="#e53935"
              d="M10.1 18.9l-4.1-3.2c-2.4 4.6-2.4 10.2 0 14.9l4.1-3.2C8.9 24.3 8.9 19.7 10.1 18.9z"
            />
            <path
              fill="#4caf50"
              d="M24 10c3.2 0 6.2 1.2 8.5 3.2l6.4-6.4C35.3 3.6 30 2 24 2 15 2 7.2 7.6 4 14.5l6.1 4.5C12.9 13.5 18 10 24 10z"
            />
            <path
              fill="#1565c0"
              d="M24 46c6 0 11.2-2.3 15-6.1l-6.7-5.7C29.8 35.6 27 37 24 37c-5 0-9.3-3.3-10.7-8.1L7.2 31c3.3 6.8 10.3 12 16.8 12z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
