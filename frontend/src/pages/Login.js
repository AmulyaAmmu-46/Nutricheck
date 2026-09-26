import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import FaceCapture from '../components/FaceCapture';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFaceLogin = async (descriptor = null) => {
    setError('');
    setSuccess('');
    if (!formData.email) {
      setError('Enter your email address before using biometric login.');
      return;
    }
    
    const currentDescriptor = descriptor || faceDescriptor;
    if (!currentDescriptor) {
      setError('Capture your face before signing in.');
      return;
    }

    setBiometricLoading(true);
    try {
      const response = await api.post('/api/auth/face-login', {
        email: formData.email,
        faceDescriptor: currentDescriptor,
      });

      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        login(token, userData);
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Biometric login failed.';
      setError(msg);
      if (msg === 'Face is not matching') {
        alert('Face is not matching');
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  const onFaceCapture = (descriptor) => {
    setFaceDescriptor(descriptor);
    handleFaceLogin(descriptor);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-100 via-violet-100 to-fuchsia-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10 transition-all hover:shadow-cyan-200">
        <div className="mb-6">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500 drop-shadow-sm">
            🍎 Nuricheck
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium">
              {success}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow sm:text-sm bg-gray-50/50 focus:bg-white"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <FaceCapture onDescriptor={onFaceCapture} disabled={biometricLoading} />

          <button
            type="button"
            onClick={() => handleFaceLogin()}
            disabled={biometricLoading}
            className="w-full flex justify-center py-3 px-4 border border-cyan-300 text-sm font-bold rounded-xl text-cyan-700 bg-cyan-50 hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {biometricLoading ? 'Matching face...' : 'Sign in with Camera Face'}
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors">
              Forgot your password?
            </Link>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-cyan-600 hover:text-cyan-800 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
