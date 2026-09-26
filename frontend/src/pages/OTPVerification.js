import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [storedOtp, setStoredOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registerEmail');
    const savedOtp = sessionStorage.getItem('registerOtp');
    if (!storedEmail) {
      navigate('/register');
    } else {
      setEmail(storedEmail);
      if (savedOtp) {
        setStoredOtp(savedOtp);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/verify-otp', {
        email,
        otp,
      });

      if (response.data.success) {
        sessionStorage.removeItem('registerEmail');
        sessionStorage.removeItem('registerOtp');
        navigate('/login', { state: { message: 'OTP verified successfully! Please login.' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-100 via-violet-100 to-fuchsia-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10 transition-all hover:shadow-cyan-200">
        <div className="mb-6">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500 drop-shadow-sm">
            🔐 Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit OTP sent to your email
          </p>
          <p className="mt-1 text-center text-xs font-semibold text-cyan-600">
            {email}
          </p>
          {storedOtp && (
            <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
              <p className="text-sm font-semibold mb-1">📱 Demo OTP (for testing):</p>
              <p className="text-2xl font-mono font-bold text-center text-blue-700">{storedOtp}</p>
              <p className="text-xs mt-1 text-center text-blue-600">Copy this OTP and paste it below</p>
            </div>
          )}
        </div>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow text-center text-2xl tracking-widest font-bold bg-gray-50/50 focus:bg-white text-cyan-700"
              placeholder="000000"
              value={otp}
              onChange={handleChange}
            />
            {!storedOtp && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                Check your email for the OTP. For demo purposes, the OTP was shown during registration.
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-bold text-sm text-cyan-600 hover:text-cyan-800 transition-colors"
            >
              Back to Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;

