import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-violet-100 to-fuchsia-100 flex flex-col items-center justify-center py-8 px-6 relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl w-full bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 px-8 py-10 text-center relative z-10"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 mb-4 drop-shadow-sm"
                >
                    NutriCheck
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-700 mb-8 font-medium leading-relaxed"
                >
                    Your personal companion for a healthier, balanced life. <br />
                    Track meals, monitor progress, and achieve your goals with ease.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Get Started
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </motion.div>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10">
                {[
                    { title: "Smart Tracking", icon: "🥗", desc: "Effortlessly log your meals and track nutritional intake." },
                    { title: "Personalized Insights", icon: "📊", desc: "Get tailored recommendations based on your unique goals." },
                    { title: "Health Monitoring", icon: "💓", desc: "Keep an eye on vital health metrics alongside your diet." }
                ].map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + (index * 0.2), duration: 0.8 }}
                        className="bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-md text-center hover:bg-white/70 hover:shadow-lg transition-all"
                    >
                        <div className="text-3xl mb-3">{feature.icon}</div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
