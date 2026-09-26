import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset

    // Step 1 Data
    const [email, setEmail] = useState('');

    // Step 2 Data
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // UI States
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoOtp, setDemoOtp] = useState('');

    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            setStep(2);
            setMessage(response.data.message);
            if (response.data.data?.otp) {
                setDemoOtp(response.data.data.otp); // Show OTP purely for demo/testing convenience
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });

            setMessage(response.data.message);
            // Wait a moment then redirect to login
            setTimeout(() => {
                navigate('/login', { state: { message: 'Password reset successfully. Please sign in.' } });
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
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
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600 drop-shadow-sm">
                        {step === 1 ? '🔒 Forgot Password' : '🔑 Set New Password'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 ? 'Enter your email to receive a recovery code' : `Enter the code sent to ${email}`}
                    </p>
                    {step === 2 && demoOtp && (
                        <div className="mt-4 bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 rounded-lg">
                            <p className="text-sm font-semibold mb-1">📱 Demo OTP (for testing):</p>
                            <p className="text-2xl font-mono font-bold text-center text-sky-700">{demoOtp}</p>
                            <p className="text-xs mt-1 text-center text-sky-600">Copy this OTP and paste it below</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                {message && !error && (
                    <div className="mb-4 bg-cyan-50 border border-cyan-200 text-cyan-700 px-4 py-3 rounded-lg text-sm font-medium">
                        {message}
                    </div>
                )}

                {step === 1 ? (
                    <form className="mt-6 space-y-5" onSubmit={handleRequestOTP}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow sm:text-sm bg-gray-50/50 focus:bg-white text-cyan-700"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                            >
                                {loading ? 'Sending Code...' : 'Send Recovery Code'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-6 space-y-5" onSubmit={handleResetPassword}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-1">
                                Verification Code
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                maxLength={6}
                                className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow text-center tracking-widest font-bold sm:text-lg bg-gray-50/50 focus:bg-white text-cyan-700"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                minLength={6}
                                className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow sm:text-sm bg-gray-50/50 focus:bg-white text-cyan-700"
                                placeholder="Minimum 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6 || newPassword.length < 6}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center pt-6 border-t border-gray-100 mt-6">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-cyan-600 hover:text-cyan-800 transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
